from datetime import date

def calculate_age(birth_date: date, on_date: date = date.today()) -> int:
    return on_date.year - birth_date.year - ((on_date.month, on_date.day) < (birth_date.month, birth_date.day))

def calculate_bmi(weight_kg: float, height_cm: float) -> float | None:
    if not height_cm or height_cm <= 0:
        return None
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 2)

def calculate_ffmi(weight_kg: float, height_cm: float, body_fat_percentage: float) -> float | None:
    if not height_cm or height_cm <= 0 or body_fat_percentage is None:
        return None
    
    lean_mass_kg = weight_kg * (1 - (body_fat_percentage / 100))
    height_m = height_cm / 100
    return round(lean_mass_kg / (height_m ** 2), 2)

def calculate_bmr(weight_kg: float, height_cm: float, age_years: int, sex: str) -> float | None:
    if not height_cm or height_cm <= 0 or not age_years or not sex:
        return None
    
    # Mifflin-St Jeor Equation
    base_bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age_years)
    
    if sex.lower() == "male":
        return round(base_bmr + 5, 2)
    elif sex.lower() == "female":
        return round(base_bmr - 161, 2)
    
    return None
