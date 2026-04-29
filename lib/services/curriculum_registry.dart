class CurriculumRegistry {
  static const Map<String, dynamic> registry = {
    "Academic": {
      "GCSE": {
        "level": "Secondary",
        "subjects": {
          "Computer Science": [
            "What is Artificial Intelligence",
            "Applications of AI",
            "Ethics of AI",
          ],
        },
      },
      "WAEC": {
        "level": "Secondary",
        "subjects": {
          "Computer Studies": [
            "Artificial Intelligence",
            "Uses of Computers",
            "Data Processing",
          ],
        },
      },
      "BTech": {
        "level": "Undergraduate",
        "subjects": {
          "Computer Science": [
            "Types of Artificial Intelligence",
            "Machine Learning Basics",
            "Intelligent Systems",
          ],
        },
      },
    },

    "Employability": {
      "Graduate Employability": {
        "level": "Career",
        "subjects": {
          "Career Skills": [
            "CV Writing",
            "Interview Skills",
            "Workplace Communication",
          ],
        },
      },
    },

    "Personal Development": {
      "Self Growth": {
        "level": "Life Skills",
        "subjects": {
          "Personal Effectiveness": [
            "Time Management",
            "Confidence Building",
            "Goal Setting",
          ],
        },
      },
    },

    "Entrepreneurship": {
      "Startup Fundamentals": {
        "level": "Business",
        "subjects": {
          "Entrepreneurship": [
            "Idea Generation",
            "Problem–Solution Fit",
            "Business Models",
          ],
        },
      },
    },
  };
}