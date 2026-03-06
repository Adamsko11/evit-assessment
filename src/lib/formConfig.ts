export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'radio' | 'checkbox';
  required: boolean;
  options?: string[];
  placeholder?: string;
  conditional?: { field: string; value: string };
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

export const formSections: FormSection[] = [
  {
    title: "About You & Your Company",
    description: "Let's start with some basic information about you and your organization.",
    fields: [
      { id: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
      { id: 'linkedin_profile', label: 'LinkedIn Profile', type: 'text', required: false, placeholder: 'https://linkedin.com/in/yourprofile' },
      { id: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g. CEO, CTO, Founder' },
      { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
      { id: 'organization', label: 'Organization', type: 'text', required: true, placeholder: 'Your company name' },
      {
        id: 'company_size', label: '1. Company Size', type: 'radio', required: true,
        options: ['Solo Founder', '2-10 Employees', '11-50 Employees', '51-100 Employees', '100+ Employees']
      },
      {
        id: 'annual_revenue', label: '2. Annual Revenue', type: 'checkbox', required: true,
        options: ['<$100k', '$100k - $500k', '$500k - $1M', '$1M - $5M', '$5M+']
      },
      {
        id: 'main_client_type', label: '3. Main Client Type', type: 'radio', required: true,
        options: ['Startups', 'SMEs', 'Large Enterprise', 'Other']
      },
    ]
  },
  {
    title: "Current Sales Situation",
    description: "Help us understand your current sales foundation and capabilities.",
    fields: [
      {
        id: 'has_sales_team', label: '4. Do you currently have a sales team? (Account Manager / Business Development / Sales)', type: 'radio', required: true,
        options: ['No', '1-2 Salespeople', '3-5 Salespeople', 'More than 5']
      },
      {
        id: 'main_sales_channels', label: '5. What are your main sales channels today?', type: 'checkbox', required: true,
        options: ['Referrals / word of mouth', 'Inbound (ads, website, content)', 'Outbound (LinkedIn, cold email, calls)', 'Partnerships / networks', 'Other']
      },
      {
        id: 'has_icp', label: '6. Do you have a defined Ideal Customer Profile (ICP) for your target market?', type: 'radio', required: true,
        options: ['Yes', 'No']
      },
      {
        id: 'has_usp', label: '7. Have you clearly identified your unique differentiators in global markets (USP)?', type: 'radio', required: true,
        options: ['Yes', 'No']
      },
      {
        id: 'icp_description', label: 'If yes, please describe briefly your Ideal Customer Profile (ICP):', type: 'textarea', required: false,
        placeholder: 'Describe your ideal customer...'
      },
      {
        id: 'has_service_offering', label: '8. Have you defined a clear service offering tailored to international clients?', type: 'radio', required: true,
        options: ['Yes', 'No']
      },
      {
        id: 'service_offering_description', label: 'If yes, please describe briefly your service offering:', type: 'textarea', required: false,
        placeholder: 'Describe your service offering...'
      },
    ]
  },
  {
    title: "Challenges & Needs",
    description: "Tell us about the obstacles you're facing and what you need most.",
    fields: [
      {
        id: 'biggest_challenge', label: "10. What's your biggest challenge in winning new clients right now?", type: 'textarea', required: true,
        placeholder: 'Describe your biggest challenge...'
      },
      {
        id: 'tried_sales_function', label: '11. Have you tried building a sales function in the past?', type: 'radio', required: true,
        options: ["Yes, but it didn't work", "Yes, and it worked", "No - not yet"]
      },
      {
        id: 'one_thing_to_change', label: '12. If you could change one thing about how you get clients and it would have the biggest positive impact on your business \u2014 what would it be?', type: 'textarea', required: true,
        placeholder: 'What one change would have the biggest impact?'
      },
    ]
  },
  {
    title: "Readiness & Urgency",
    description: "Help us understand your timeline and investment capacity.",
    fields: [
      {
        id: 'monthly_budget', label: '13. What is your current monthly budget for sales and marketing?', type: 'radio', required: true,
        options: ['$0', '$1\u20133k', '$3\u20138k', '$8k+']
      },
      {
        id: 'urgency', label: '14. How urgent is scaling your sales right now?', type: 'radio', required: true,
        options: ['Not urgent \u2013 exploring options', 'Important, but not immediate', 'Urgent \u2013 we need to act in the next 3\u20136 months', 'Critical \u2013 we must act now']
      },
    ]
  },
  {
    title: "Almost Done!",
    description: "\ud83d\udc49 Your answers will be reviewed within 24 hours to determine whether global expansion makes sense now, later, or not at all.",
    fields: [
      {
        id: 'preferred_contact', label: 'Please let us know your preferred way to receive a summary', type: 'radio', required: true,
        options: ['Email', '1 on 1 online call', 'LinkedIn Message (please make sure you provided LinkedIn URL)']
      },
    ]
  },
];
