import OpenAI from 'openai';

// For demo purposes, if no API key is provided, use a mock response
const mockAIResponse = async (prompt: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  if (prompt.toLowerCase().includes('headache')) {
    return "If you're experiencing headaches, it could be due to various factors such as stress, dehydration, or eye strain. Try these general tips:\n\n1. Stay hydrated\n2. Get adequate rest\n3. Practice stress management\n\nHowever, if headaches are severe or persistent, please consult a healthcare professional for proper evaluation.";
  }
  
  if (prompt.toLowerCase().includes('exercise')) {
    return "Regular exercise is important for maintaining good health. General recommendations include:\n\n1. 150 minutes of moderate aerobic activity per week\n2. Strength training 2-3 times per week\n3. Daily stretching for flexibility\n\nBefore starting any new exercise routine, consult your healthcare provider, especially if you have any existing medical conditions.";
  }
  
  return "I understand your health concern. While I can provide general information, it's important to consult with a qualified healthcare provider for personalized medical advice. They can properly evaluate your specific situation and provide appropriate recommendations.";
};

// Mock AI analysis for medical records
const mockAIAnalysis = async (fileData: any) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis delay

  // Generate different analyses based on file type or content
  const analyses = [
    {
      summary: "Blood test results show normal ranges for most markers. Vitamin D levels are slightly below optimal range.",
      recommendations: [
        "Consider vitamin D supplementation",
        "Increase sun exposure safely",
        "Schedule follow-up in 3 months",
        "Include vitamin D-rich foods in diet"
      ],
      risk_factors: [
        "Vitamin D deficiency may impact bone health",
        "Low vitamin D may affect immune system function",
        "Seasonal variation in sun exposure"
      ]
    },
    {
      summary: "ECG results indicate normal sinus rhythm. No significant abnormalities detected.",
      recommendations: [
        "Maintain regular exercise routine",
        "Continue heart-healthy diet",
        "Annual cardiac check-up recommended",
        "Monitor blood pressure regularly"
      ],
      risk_factors: [
        "Family history of heart disease noted",
        "Sedentary lifestyle risk factor present",
        "Moderate caffeine consumption"
      ]
    },
    {
      summary: "Chest X-ray shows clear lung fields. No acute cardiopulmonary process identified.",
      recommendations: [
        "No immediate follow-up needed",
        "Continue regular health maintenance",
        "Report any new respiratory symptoms",
        "Maintain good air quality at home/work"
      ],
      risk_factors: [
        "Previous smoking history noted",
        "Occupational exposure to irritants",
        "Seasonal allergies may affect respiratory health"
      ]
    },
    {
      summary: "MRI scan of the lumbar spine shows mild degenerative changes at L4-L5 level.",
      recommendations: [
        "Physical therapy evaluation recommended",
        "Core strengthening exercises",
        "Proper ergonomic setup at work",
        "Weight management program if applicable",
        "Regular stretching routine"
      ],
      risk_factors: [
        "Sedentary work environment",
        "Previous sports injuries",
        "Family history of osteoarthritis",
        "Current body weight status"
      ]
    },
    {
      summary: "Comprehensive metabolic panel indicates elevated liver enzymes (ALT/AST).",
      recommendations: [
        "Follow-up testing in 4-6 weeks",
        "Alcohol reduction advised",
        "Review current medications with provider",
        "Dietary modifications recommended",
        "Consider hepatology consultation"
      ],
      risk_factors: [
        "Medication interactions possible",
        "Alcohol consumption patterns",
        "Family history of liver disease",
        "Recent weight changes noted"
      ]
    },
    {
      summary: "Annual eye examination reveals mild myopia progression and early signs of digital eye strain.",
      recommendations: [
        "Update prescription glasses",
        "Implement 20-20-20 rule for screen time",
        "Use artificial tears as needed",
        "Consider blue light filtering lenses",
        "Follow-up in 12 months"
      ],
      risk_factors: [
        "Extended screen time exposure",
        "Family history of vision problems",
        "Poor lighting conditions at work",
        "Irregular break patterns"
      ]
    },
    {
      summary: "Dental examination shows early signs of gingivitis and one cavity in molar #18.",
      recommendations: [
        "Schedule dental cleaning",
        "Improve flossing routine",
        "Use prescription fluoride toothpaste",
        "Consider electric toothbrush",
        "Follow-up for cavity treatment"
      ],
      risk_factors: [
        "Irregular dental hygiene routine",
        "High sugar consumption",
        "Grinding teeth at night",
        "Family history of periodontal disease"
      ]
    },
    {
      summary: "Sleep study results indicate mild sleep apnea with an AHI of 8 events/hour.",
      recommendations: [
        "Weight management program",
        "Sleep position therapy",
        "Consider CPAP evaluation",
        "Follow sleep hygiene guidelines",
        "Follow-up with sleep specialist"
      ],
      risk_factors: [
        "BMI above optimal range",
        "Family history of sleep disorders",
        "Anatomical factors noted",
        "Evening alcohol consumption"
      ]
    }
  ];

  // Return a random analysis for demo purposes
  return analyses[Math.floor(Math.random() * analyses.length)];
};

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const openai = apiKey && apiKey !== 'your_openai_api_key_here' 
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Only for demo purposes
    })
  : null;

export async function getAIResponse(prompt: string) {
  try {
    // If no API key is provided, use mock responses
    if (!openai) {
      return await mockAIResponse(prompt);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical AI assistant. Provide accurate, professional medical information while always advising users to consult healthcare professionals for specific medical advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI response:', error);
    // Fallback to mock response if API fails
    return await mockAIResponse(prompt);
  }
}

export async function getAIAnalysis(fileData: any) {
  try {
    if (!openai) {
      return await mockAIAnalysis(fileData);
    }

    // In a real application, you would process the file data and send relevant information to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant analyzing medical records. Provide professional analysis with recommendations and risk factors."
        },
        {
          role: "user",
          content: `Analyze this medical record: ${JSON.stringify(fileData)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse the response into the expected format
    // This is a simplified example - in a real app, you'd want more structured output
    return {
      summary: response.choices[0].message.content?.split('\n')[0] || 'Analysis completed',
      recommendations: ['Consult with healthcare provider', 'Follow up as recommended'],
      risk_factors: ['Please consult healthcare provider for risk assessment']
    };
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    // Fallback to mock analysis if API fails
    return await mockAIAnalysis(fileData);
  }
}