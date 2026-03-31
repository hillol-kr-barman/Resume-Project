import json
import os
import ssl
from pathlib import Path
from urllib import error, request

import stripe
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    import certifi
except ImportError:  # pragma: no cover
    certifi = None


app = FastAPI(title="Resume Project API")

class CheckoutRequest(BaseModel):
    tier: str

PRICE_MAP = {
    "espresso": 500,
    "double": 1000,
    "snacks": 2000,
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SignUpRequest(BaseModel):
    email: str
    password: str = Field(min_length=6)
    name: str | None = None


def load_env_file() -> None:
    env_candidates = [
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parent.parent / "resume-website" / ".env.local",
    ]

    for env_path in env_candidates:
        if not env_path.exists():
            continue

        for line in env_path.read_text().splitlines():
            stripped = line.strip()

            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue

            key, value = stripped.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("'\""))


load_env_file()


def get_supabase_config() -> tuple[str, str]:
    supabase_url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
    supabase_key = (
        os.getenv("SUPABASE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY")
        or os.getenv("VITE_SUPABASE_ANON_KEY")
    )

    if not supabase_url or not supabase_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Supabase credentials are missing. Set SUPABASE_URL with SUPABASE_KEY or "
                "SUPABASE_ANON_KEY, or provide VITE_SUPABASE_URL with "
                "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY or VITE_SUPABASE_ANON_KEY "
                "in resume-website/.env.local."
            ),
        )

    return supabase_url.rstrip("/"), supabase_key


def get_ssl_context() -> ssl.SSLContext:
    # Some local Python installs do not have a populated system CA bundle.
    if certifi is not None:
        return ssl.create_default_context(cafile=certifi.where())
    return ssl.create_default_context()


def get_stripe_config() -> tuple[str, str]:
    stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
    frontend_base_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")

    if not stripe_secret_key or "..." in stripe_secret_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Stripe is not configured. Set a real STRIPE_SECRET_KEY in backend/.env or "
                "resume-website/.env.local."
            ),
        )

    return stripe_secret_key, frontend_base_url


def supabase_sign_up(payload: SignUpRequest) -> dict:
    supabase_url, supabase_key = get_supabase_config()
    signup_url = f"{supabase_url}/auth/v1/signup"
    normalized_email = payload.email.strip().lower()

    if "@" not in normalized_email:
        raise HTTPException(status_code=422, detail="A valid email address is required.")

    body = {
        "email": normalized_email,
        "password": payload.password,
    }

    if payload.name:
        body["data"] = {"name": payload.name.strip()}

    req = request.Request(
        signup_url,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, context=get_ssl_context()) as response:
            return json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        raw_error = exc.read().decode("utf-8")

        try:
            parsed_error = json.loads(raw_error)
            detail = parsed_error.get("msg") or parsed_error.get("error_description") or parsed_error
        except json.JSONDecodeError:
            detail = raw_error or "Supabase signup failed."

        raise HTTPException(status_code=exc.code, detail=detail) from exc
    except error.URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not reach Supabase: {exc.reason}",
        ) from exc


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/signup")
def signup(payload: SignUpRequest) -> dict:
    signup_response = supabase_sign_up(payload)
    user = signup_response.get("user")

    if not user:
        raise HTTPException(status_code=400, detail="Supabase did not return a user.")

    return {
        "message": "Signup successful. Check your email if confirmation is enabled in Supabase.",
        "user": {
            "id": user.get("id"),
            "email": user.get("email"),
        },
        "session": signup_response.get("session"),
    }

@app.post("/create-checkout-session")
def create_checkout_session(payload: CheckoutRequest):
    stripe_secret_key, frontend_base_url = get_stripe_config()
    amount = PRICE_MAP.get(payload.tier)
    if not amount:
        raise HTTPException(status_code=400, detail="Invalid support tier.")

    stripe.api_key = stripe_secret_key

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            success_url=f"{frontend_base_url}/coffee?status=success",
            cancel_url=f"{frontend_base_url}/coffee?status=cancelled",
            line_items=[
                {
                    "price_data": {
                        "currency": "aud",
                        "product_data": {"name": "Buy me a coffee"},
                        "unit_amount": amount,
                    },
                    "quantity": 1,
                }
            ],
        )
    except stripe.error.StripeError as exc:
        message = getattr(exc, "user_message", None) or str(exc) or "Stripe checkout session creation failed."
        raise HTTPException(status_code=502, detail=message) from exc

    return {"url": session.url}
