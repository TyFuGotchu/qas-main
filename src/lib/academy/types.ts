export interface AcademyLesson {
  id: string;
  title: string;
  summary: string;
  body: string[];
  keyPoints?: string[];
  manualTips?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export interface AcademySection {
  id: string;
  title: string;
  description: string;
  lessons: AcademyLesson[];
}

export interface AcademyCategory {
  id: string;
  title: string;
  description: string;
  sections: AcademySection[];
}