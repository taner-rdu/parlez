import argparse
from datetime import datetime, timedelta, timezone

from jose import jwt

from app.config import get_jwt_secret


def mint_token(email: str, hours: int) -> str:
    payload = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=hours),
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm="HS256")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mint a JWT for the Parlez API")
    parser.add_argument("--email", default="default@parlez.dev")
    parser.add_argument("--hours", type=int, default=24)
    args = parser.parse_args()

    print(mint_token(args.email, args.hours))