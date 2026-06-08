def add(numbers):
    if numbers == "":
        return 0
    
    # Normalizamos los delimitadores
    normalized_numbers = numbers.replace("\n", ",")
    
    # Convertimos todos los strings a enteros y los guardamos en una lista
    num_list = [int(num) for num in normalized_numbers.split(",")]
    
    # Filtramos para ver si hay algún número negativo
    negatives = [num for num in num_list if num < 0]
    
    if negatives:
        # Si hay negativos, armamos el mensaje y lanzamos la excepción.
        # Usamos map(str) para poder unir los números con comas si hubiera más de uno.
        negatives_str = ",".join(map(str, negatives))
        raise ValueError(f"negatives not allowed: {negatives_str}")
    
    # Si llegamos acá, es porque no hubo negativos, así que sumamos tranquilos
    return sum(num_list)