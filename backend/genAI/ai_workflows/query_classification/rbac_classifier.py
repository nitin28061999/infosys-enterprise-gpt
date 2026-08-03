from typing import List, Dict

# Strict Department Clearance Matrix
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    # Engineering & Tech (NO Sales/HR access)
    "Software Engineer": ["Engineering", "Delivery Operations", "PMO"],
    "Senior Software Engineer": ["Engineering", "Delivery Operations", "PMO"],
    "DevOps Lead": ["Engineering", "Delivery Operations"],
    "Solutions Architect": ["Engineering", "Delivery Operations", "PMO"],
    "Engineering Lead": ["Engineering", "Delivery Operations", "PMO"],
    
    # Sales & Business Development (NO Engineering/Delivery Ops access)
    "Sales Executive": ["Sales", "Human Resources"],
    "Business Development Manager": ["Sales", "PMO"],
    "Account Manager": ["Sales"],
    "Sales Enablement Lead": ["Sales", "Human Resources", "PMO"],
    
    # Operations & Project Management
    "Delivery Manager": ["Delivery Operations", "PMO", "Engineering"],
    "PMO Lead": ["PMO", "Delivery Operations", "Engineering"],
    "Operations Lead": ["Delivery Operations"],
    
    # Human Resources (STRICT HR ONLY - NO Sales/Engineering access)
    "HR Associate": ["Human Resources"],
    "HR Operations Lead": ["Human Resources"],
    
    # Executive & Management (FULL ACCESS across all 5 domains)
    "Senior Manager": ["Engineering", "Delivery Operations", "PMO", "Human Resources", "Sales"]
}


class QueryRBACClassifier:
    @staticmethod
    def get_allowed_departments(designation: str) -> List[str]:
        return ROLE_PERMISSIONS.get(designation, ["Engineering"])
