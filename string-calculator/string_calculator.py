def add(numbers):
    if numbers == "":
        return 0

    delimiter = ","
    if numbers.startswith("//"):
        delimiter, numbers = numbers[2:].split("\n", 1)

    normalized = numbers.replace("\n", ",").replace(delimiter, ",")
    num_list = [int(n) for n in normalized.split(",")]

    negatives = [n for n in num_list if n < 0]
    if negatives:
        raise ValueError(f"negatives not allowed: {','.join(map(str, negatives))}")

    return sum(num_list)