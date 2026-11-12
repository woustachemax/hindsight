import io

import pandas as pd


def parse_equity_csv(file_bytes: bytes) -> pd.DataFrame:
    def load(skiprows: int = 0) -> pd.DataFrame:
        if skiprows > 0:
            return pd.read_csv(
                io.BytesIO(file_bytes),
                skiprows=skiprows,
                header=None,
                names=["date", "close", "high", "low", "open", "volume"],
            )
        return pd.read_csv(io.BytesIO(file_bytes))

    df = load()

    numeric_cols = df.select_dtypes(include="number").columns

    if len(numeric_cols) == 0:
        df = load(skiprows=3)
    else:
        sample = pd.to_numeric(df[numeric_cols[0]], errors="coerce").head(5)
        if sample.isna().sum() > 2:
            df = load(skiprows=3)

    columns = {col.lower(): col for col in df.columns}

    date_col = next(
        (
            columns[col]
            for col in columns
            if any(keyword in col for keyword in ["date", "time", "timestamp"])
        ),
        None,
    )

    value_col = next(
        (
            columns[col]
            for col in columns
            if any(
                keyword in col
                for keyword in [
                    "close",
                    "adj close",
                    "portfolio",
                    "equity",
                    "value",
                    "nav",
                    "price",
                ]
            )
        ),
        None,
    )

    if date_col is None or value_col is None:
        raise ValueError("Could not identify date or portfolio value column.")

    df = df.rename(columns={date_col: "date", value_col: "close"})
    df["date"] = pd.to_datetime(df["date"])
    df["close"] = pd.to_numeric(df["close"], errors="coerce")

    df = df[["date", "close"]].dropna().sort_values("date").reset_index(drop=True)

    df["returns"] = df["close"].pct_change()
    df = df.dropna().reset_index(drop=True)

    return df
