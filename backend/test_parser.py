from src.parsers.csv import parse_equity_csv

with open("spy.csv", "rb") as f:
    result = parse_equity_csv(f.read())
print(result.head())

with open("test_clean.csv", "rb") as f:
    result2 = parse_equity_csv(f.read())
print(result2.head())
