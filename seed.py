from database import SessionLocal, engine, Base
from models import Specialist

def seed_specialists():
    db = SessionLocal()
    
    # Check if we already seeded
    if db.query(Specialist).first():
        print("Specialists already seeded.")
        db.close()
        return

    doctors = [
        {"name": "Dr. Sarah Jenkins", "specialty": "Dermatologist", "location": "New York, NY", "contact": "555-0101", "rating": 4.8},
        {"name": "Dr. Michael Chen", "specialty": "Dermatologist", "location": "San Francisco, CA", "contact": "555-0102", "rating": 4.9},
        
        {"name": "Dr. Emily Stone", "specialty": "Cardiologist", "location": "Chicago, IL", "contact": "555-0201", "rating": 4.9},
        {"name": "Dr. Robert Singh", "specialty": "Cardiologist", "location": "Houston, TX", "contact": "555-0202", "rating": 4.7},
        
        {"name": "Dr. Amanda Torres", "specialty": "Pulmonologist", "location": "Miami, FL", "contact": "555-0301", "rating": 4.8},
        
        {"name": "Dr. James Wilson", "specialty": "Gastroenterologist", "location": "Boston, MA", "contact": "555-0401", "rating": 4.6},
        {"name": "Dr. Lisa Cuddy", "specialty": "Gastroenterologist", "location": "Seattle, WA", "contact": "555-0402", "rating": 4.8},
        
        {"name": "Dr. Mark Sloan", "specialty": "Rheumatologist", "location": "Los Angeles, CA", "contact": "555-0501", "rating": 4.7},
        
        {"name": "Dr. Gregory House", "specialty": "Endocrinologist", "location": "Princeton, NJ", "contact": "555-0601", "rating": 4.9},
        
        {"name": "Dr. Derek Shepherd", "specialty": "Neurologist", "location": "Seattle, WA", "contact": "555-0701", "rating": 4.9},
        
        {"name": "Dr. John Dorian", "specialty": "General Physician", "location": "Sacramento, CA", "contact": "555-0801", "rating": 4.8},
        {"name": "Dr. Elliot Reid", "specialty": "General Physician", "location": "Sacramento, CA", "contact": "555-0802", "rating": 4.7},
        
        {"name": "Dr. Chris Turk", "specialty": "General Surgeon", "location": "Sacramento, CA", "contact": "555-0901", "rating": 4.8},
        
        {"name": "Dr. Perry Cox", "specialty": "Urologist", "location": "Sacramento, CA", "contact": "555-1001", "rating": 4.6},
        
        {"name": "Dr. Allison Cameron", "specialty": "ENT Specialist", "location": "Princeton, NJ", "contact": "555-1101", "rating": 4.8},
        
        {"name": "Dr. Eric Foreman", "specialty": "Infectious Disease Specialist", "location": "Princeton, NJ", "contact": "555-1201", "rating": 4.7},
    ]

    for d in doctors:
        spec = Specialist(**d)
        db.add(spec)
    
    db.commit()
    print("Successfully seeded 16 specialists.")
    db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_specialists()
