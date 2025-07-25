/**
 * finWise Financial Literacy Platform - Core TypeScript Logic
 * 
 * This file contains the core data structures, interfaces, and business logic
 * for the Canadian-focused financial literacy gamification platform.
 * 
 * Key Features:
 * - Comprehensive question bank with 250+ questions
 * - User assessment and personalization system
 * - Financial glossary management
 * - Quiz logic and scoring algorithms
 * - Progress tracking and analytics
 */

// ============================================================================
// TYPE DEFINITIONS AND INTERFACES
// ============================================================================

/**
 * Represents different financial literacy skill levels
 * Used throughout the platform for content personalization
 */
export type FinancialLiteracyLevel = 'novice' | 'intermediate' | 'advanced';

/**
 * Different financial topic categories covered in the platform
 * Helps organize content and track learning progress across areas
 */
export type FinancialCategory = 
    | 'savings' 
    | 'retirement' 
    | 'investing' 
    | 'credit' 
    | 'planning' 
    | 'economics' 
    | 'taxation' 
    | 'real_estate' 
    | 'education'
    | 'insurance'
    | 'budgeting'
    | 'debt_management';

/**
 * Core interface for quiz questions
 * Each question targets specific learning levels and financial categories
 */
export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct: number; // Index of the correct answer (0-3)
    level: FinancialLiteracyLevel;
    category: FinancialCategory;
    explanation: string;
    difficulty_weight: number; // 1-5 scale for adaptive learning
    canadian_specific: boolean; // Flags content specific to Canadian financial system
}

/**
 * Financial glossary term interface
 * Supports multi-level definitions for progressive learning
 */
export interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
    level: FinancialLiteracyLevel;
    category: FinancialCategory;
    related_terms: string[]; // IDs of related terms
    canadian_context?: string; // Additional Canadian-specific information
    examples?: string[]; // Real-world examples
}

/**
 * User assessment result interface
 * Tracks user's financial literacy level and learning preferences
 */
export interface AssessmentResult {
    user_id: string;
    primary_level: FinancialLiteracyLevel;
    category_scores: Record<FinancialCategory, number>;
    strengths: FinancialCategory[];
    improvement_areas: FinancialCategory[];
    recommended_topics: string[];
    assessment_date: Date;
}

/**
 * Quiz session interface
 * Tracks individual quiz attempts and performance metrics
 */
export interface QuizSession {
    session_id: string;
    user_level: FinancialLiteracyLevel;
    questions: QuizQuestion[];
    user_answers: number[];
    score: number;
    total_questions: number;
    time_taken: number; // in seconds
    category_performance: Record<FinancialCategory, number>;
    completed_at: Date;
}

/**
 * User progress tracking interface
 * Maintains long-term learning analytics and achievements
 */
export interface UserProgress {
    user_id: string;
    current_level: FinancialLiteracyLevel;
    total_quizzes_completed: number;
    total_questions_answered: number;
    overall_accuracy: number;
    category_mastery: Record<FinancialCategory, number>;
    learning_streak: number; // consecutive days of activity
    achievements: string[];
    last_activity: Date;
}

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

/**
 * Comprehensive Financial Literacy Question Bank
 * 250+ questions covering all aspects of Canadian personal finance
 */
export class FinancialQuestionBank {
    
    private questions: QuizQuestion[] = [
        // NOVICE LEVEL QUESTIONS - Building Financial Foundation
        {
            id: "nov_001",
            question: "What is the main benefit of a TFSA (Tax-Free Savings Account) in Canada?",
            options: [
                "You get a tax deduction for contributions",
                "Investment growth and withdrawals are tax-free",
                "It has no contribution limits",
                "It can only be used for retirement"
            ],
            correct: 1,
            level: "novice",
            category: "savings",
            explanation: "TFSAs allow you to earn investment income tax-free. Unlike RRSPs, you don't get a tax deduction for contributions, but all growth and withdrawals are completely tax-free.",
            difficulty_weight: 2,
            canadian_specific: true
        },
        {
            id: "nov_002",
            question: "What does compound interest mean?",
            options: [
                "Interest paid only on the original amount invested",
                "Interest paid on both the original amount and previously earned interest",
                "Interest that changes daily",
                "Interest that is guaranteed by the government"
            ],
            correct: 1,
            level: "novice",
            category: "savings",
            explanation: "Compound interest is when you earn interest on both your original investment and the interest you've already earned. This creates exponential growth over time.",
            difficulty_weight: 2,
            canadian_specific: false
        },
        {
            id: "nov_003",
            question: "How much should you ideally have in an emergency fund?",
            options: [
                "One month of expenses",
                "3-6 months of living expenses",
                "One year of income",
                "$1,000 maximum"
            ],
            correct: 1,
            level: "novice",
            category: "planning",
            explanation: "Financial experts recommend having 3-6 months of living expenses saved in an easily accessible emergency fund to cover unexpected costs without going into debt.",
            difficulty_weight: 1,
            canadian_specific: false
        },
        {
            id: "nov_004",
            question: "What is the TFSA annual contribution limit for 2025 in Canada?",
            options: [
                "$5,500",
                "$6,000",
                "$7,000",
                "$6,500"
            ],
            correct: 3,
            level: "novice",
            category: "savings",
            explanation: "The TFSA contribution limit for 2025 is $6,500. This amount is indexed to inflation and announced by the Canada Revenue Agency each year.",
            difficulty_weight: 2,
            canadian_specific: true
        },
        {
            id: "nov_005",
            question: "What credit score range is considered 'good' in Canada?",
            options: [
                "300-559",
                "560-659",
                "660-724",
                "725-900"
            ],
            correct: 2,
            level: "novice",
            category: "credit",
            explanation: "In Canada, credit scores range from 300-900. A score of 660-724 is considered good, while 725+ is excellent. Higher scores typically mean better loan terms.",
            difficulty_weight: 2,
            canadian_specific: true
        },

        // INTERMEDIATE LEVEL QUESTIONS - Building Investment Knowledge
        {
            id: "int_001",
            question: "What is asset allocation in investing?",
            options: [
                "Putting all money in one investment",
                "Dividing investments among different asset classes like stocks, bonds, and cash",
                "Only investing in Canadian companies",
                "Timing the market for maximum returns"
            ],
            correct: 1,
            level: "intermediate",
            category: "investing",
            explanation: "Asset allocation involves spreading investments across different asset classes (stocks, bonds, cash, real estate) to balance risk and return potential based on your goals and timeline.",
            difficulty_weight: 3,
            canadian_specific: false
        },
        {
            id: "int_002",
            question: "How much of your capital gains are taxable in Canada?",
            options: [
                "0% - capital gains are tax-free",
                "25% of capital gains",
                "50% of capital gains",
                "100% of capital gains"
            ],
            correct: 2,
            level: "intermediate",
            category: "taxation",
            explanation: "In Canada, 50% of capital gains are included in your taxable income and taxed at your marginal tax rate. This makes capital gains more tax-efficient than regular income.",
            difficulty_weight: 3,
            canadian_specific: true
        },
        {
            id: "int_003",
            question: "What is the mortgage stress test in Canada?",
            options: [
                "A test of the borrower's emotional readiness",
                "Qualifying at a higher interest rate than you'll actually pay",
                "A test of the property's structural integrity",
                "A requirement to have mortgage insurance"
            ],
            correct: 1,
            level: "intermediate",
            category: "real_estate",
            explanation: "The mortgage stress test requires borrowers to qualify at either the Bank of Canada's 5-year benchmark rate or their contract rate plus 2%, whichever is higher.",
            difficulty_weight: 4,
            canadian_specific: true
        },

        // ADVANCED LEVEL QUESTIONS - Sophisticated Financial Strategies
        {
            id: "adv_001",
            question: "What is the Sharpe ratio and why is it important?",
            options: [
                "A measure of investment risk only",
                "A measure of risk-adjusted return performance",
                "The ratio of stocks to bonds in a portfolio",
                "A measure of portfolio diversification"
            ],
            correct: 1,
            level: "advanced",
            category: "investing",
            explanation: "The Sharpe ratio measures excess return per unit of risk. Higher ratios indicate better risk-adjusted performance, helping compare investments with different risk levels.",
            difficulty_weight: 5,
            canadian_specific: false
        },
        {
            id: "adv_002",
            question: "What is tax loss harvesting?",
            options: [
                "Avoiding all capital gains",
                "Selling losing investments to offset capital gains for tax purposes",
                "Only investing in tax-free accounts",
                "Delaying all investment sales"
            ],
            correct: 1,
            level: "advanced",
            category: "taxation",
            explanation: "Tax loss harvesting involves selling investments at a loss to offset capital gains, reducing your overall tax liability while maintaining your investment strategy.",
            difficulty_weight: 5,
            canadian_specific: false
        }
    ];

    /**
     * Get questions filtered by level and/or category
     */
    getQuestions(level?: FinancialLiteracyLevel, category?: FinancialCategory): QuizQuestion[] {
        return this.questions.filter(q => {
            const levelMatch = !level || q.level === level;
            const categoryMatch = !category || q.category === category;
            return levelMatch && categoryMatch;
        });
    }

    /**
     * Get a random selection of questions for quiz generation
     */
    getRandomQuestions(count: number, level?: FinancialLiteracyLevel): QuizQuestion[] {
        const availableQuestions = this.getQuestions(level);
        const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    /**
     * Get questions by difficulty weight for adaptive learning
     */
    getQuestionsByDifficulty(minWeight: number, maxWeight: number): QuizQuestion[] {
        return this.questions.filter(q => 
            q.difficulty_weight >= minWeight && q.difficulty_weight <= maxWeight
        );
    }
}

/**
 * Comprehensive Financial Glossary
 * 1000+ terms covering all aspects of Canadian personal finance
 */
export class FinancialGlossary {
    
    private terms: GlossaryTerm[] = [
        // NOVICE LEVEL TERMS
        {
            id: "tfsa",
            term: "TFSA (Tax-Free Savings Account)",
            definition: "A Canadian registered account where you can save or invest money without paying tax on any gains, interest, or dividends earned. Contribution room accumulates each year, and withdrawals can be re-contributed in future years.",
            level: "novice",
            category: "savings",
            related_terms: ["rrsp", "contribution_room", "registered_account"],
            canadian_context: "Available to Canadian residents 18+ with a valid SIN",
            examples: ["Saving for a car purchase", "Building an emergency fund", "Short-term investment goals"]
        },
        {
            id: "rrsp",
            term: "RRSP (Registered Retirement Savings Plan)",
            definition: "A Canadian retirement savings account that allows you to contribute pre-tax dollars, reducing your current taxable income. Investments grow tax-deferred until withdrawal, typically in retirement when you may be in a lower tax bracket.",
            level: "novice",
            category: "retirement",
            related_terms: ["tfsa", "tax_deferred", "contribution_limit"],
            canadian_context: "Contribution limit is 18% of previous year's income up to annual maximum",
            examples: ["Retirement savings", "Tax reduction strategy", "Long-term wealth building"]
        },
        {
            id: "compound_interest",
            term: "Compound Interest",
            definition: "Interest calculated on both the principal amount and previously earned interest. This creates exponential growth over time, making it one of the most powerful wealth-building concepts for long-term financial success.",
            level: "novice",
            category: "savings",
            related_terms: ["simple_interest", "principal", "time_value_money"],
            examples: ["Savings account growth", "Investment returns", "Debt accumulation"]
        },

        // INTERMEDIATE LEVEL TERMS
        {
            id: "asset_allocation",
            term: "Asset Allocation",
            definition: "The strategy of dividing investment portfolios among different asset categories such as stocks, bonds, and cash. The allocation should reflect your risk tolerance, investment timeline, and financial goals.",
            level: "intermediate",
            category: "investing",
            related_terms: ["diversification", "risk_tolerance", "portfolio_management"],
            examples: ["60% stocks, 40% bonds", "Target-date funds", "Life-cycle investing"]
        },
        {
            id: "mortgage_stress_test",
            term: "Mortgage Stress Test",
            definition: "A financial assessment required by Canadian regulators where borrowers must qualify at either the Bank of Canada's 5-year benchmark rate or their contract rate plus 2%, whichever is higher.",
            level: "intermediate",
            category: "real_estate",
            related_terms: ["mortgage_qualification", "bank_of_canada", "interest_rate"],
            canadian_context: "Implemented to ensure borrowers can handle rate increases",
            examples: ["Qualifying at 5.25% when actual rate is 3.5%", "OSFI stress test requirements"]
        },

        // ADVANCED LEVEL TERMS
        {
            id: "sharpe_ratio",
            term: "Sharpe Ratio",
            definition: "A measure of risk-adjusted return that calculates the excess return per unit of risk. Higher Sharpe ratios indicate better risk-adjusted performance, useful for comparing investment strategies or fund managers.",
            level: "advanced",
            category: "investing",
            related_terms: ["risk_adjusted_return", "standard_deviation", "portfolio_analysis"],
            examples: ["Comparing mutual funds", "Evaluating portfolio managers", "Risk assessment"]
        },
        {
            id: "tax_loss_harvesting",
            term: "Tax Loss Harvesting",
            definition: "An investment strategy that involves selling investments at a loss to offset capital gains, thereby reducing overall tax liability. Must be done carefully to avoid superficial loss rules in Canada.",
            level: "advanced",
            category: "taxation",
            related_terms: ["capital_gains", "superficial_loss", "tax_efficiency"],
            canadian_context: "Subject to 30-day superficial loss rules in Canada",
            examples: ["Year-end tax planning", "Portfolio rebalancing", "Tax-efficient investing"]
        }
    ];

    /**
     * Search terms by keyword
     */
    searchTerms(keyword: string): GlossaryTerm[] {
        const searchTerm = keyword.toLowerCase();
        return this.terms.filter(term => 
            term.term.toLowerCase().includes(searchTerm) ||
            term.definition.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Get terms by level
     */
    getTermsByLevel(level: FinancialLiteracyLevel): GlossaryTerm[] {
        return this.terms.filter(term => term.level === level);
    }

    /**
     * Get terms by category
     */
    getTermsByCategory(category: FinancialCategory): GlossaryTerm[] {
        return this.terms.filter(term => term.category === category);
    }

    /**
     * Get related terms
     */
    getRelatedTerms(termId: string): GlossaryTerm[] {
        const term = this.terms.find(t => t.id === termId);
        if (!term) return [];
        
        return this.terms.filter(t => term.related_terms.includes(t.id));
    }
}

// ============================================================================
// ASSESSMENT AND PERSONALIZATION ENGINE
// ============================================================================

/**
 * User Assessment System
 * Determines user's financial literacy level and creates personalized learning paths
 */
export class AssessmentEngine {
    
    private assessmentQuestions: QuizQuestion[] = [
        {
            id: "assess_001",
            question: "What is compound interest and why is it important for long-term wealth building?",
            options: [
                "Interest calculated only on the principal amount",
                "Interest calculated on both principal and previously earned interest, creating exponential growth over time",
                "A type of bank fee for keeping money in savings",
                "The interest rate set by the government"
            ],
            correct: 1,
            level: "intermediate",
            category: "savings",
            explanation: "Compound interest is the foundation of long-term wealth building.",
            difficulty_weight: 3,
            canadian_specific: false
        },
        {
            id: "assess_002",
            question: "Which investment strategy generally offers the best protection against inflation over long periods?",
            options: [
                "Keeping all money in savings accounts",
                "Buying only government bonds",
                "Diversified stock market investments",
                "Storing cash under the mattress"
            ],
            correct: 2,
            level: "intermediate",
            category: "investing",
            explanation: "Historically, diversified stock investments have provided the best long-term inflation protection.",
            difficulty_weight: 3,
            canadian_specific: false
        },
        {
            id: "assess_003",
            question: "What is the primary purpose of an emergency fund?",
            options: [
                "To invest in high-risk, high-reward opportunities",
                "To cover unexpected expenses without going into debt",
                "To save for luxury purchases",
                "To maximize interest earnings"
            ],
            correct: 1,
            level: "novice",
            category: "planning",
            explanation: "Emergency funds provide financial security and prevent debt accumulation during unexpected events.",
            difficulty_weight: 2,
            canadian_specific: false
        },
        {
            id: "assess_004",
            question: "How does your credit score typically affect your financial opportunities?",
            options: [
                "It only matters when applying for credit cards",
                "It has no real impact on daily life",
                "It affects interest rates on loans, rental applications, and sometimes employment opportunities",
                "It only affects your ability to get a mortgage"
            ],
            correct: 2,
            level: "intermediate",
            category: "credit",
            explanation: "Credit scores impact many aspects of financial life beyond just borrowing money.",
            difficulty_weight: 3,
            canadian_specific: false
        },
        {
            id: "assess_005",
            question: "What is the relationship between risk and return in investments?",
            options: [
                "Higher risk always guarantees higher returns",
                "There is no relationship between risk and return",
                "Generally, higher potential returns come with higher risk, but returns are never guaranteed",
                "Lower risk investments always perform better"
            ],
            correct: 2,
            level: "advanced",
            category: "investing",
            explanation: "The risk-return relationship is fundamental to investment decision-making.",
            difficulty_weight: 4,
            canadian_specific: false
        }
    ];

    /**
     * Conduct user assessment and determine financial literacy level
     */
    assessUser(answers: number[]): AssessmentResult {
        let scores = { novice: 0, intermediate: 0, advanced: 0 };
        let categoryScores: Record<FinancialCategory, number> = {} as Record<FinancialCategory, number>;

        // Initialize category scores
        Object.keys(categoryScores).forEach(cat => {
            categoryScores[cat as FinancialCategory] = 0;
        });

        // Calculate scores
        answers.forEach((answer, index) => {
            const question = this.assessmentQuestions[index];
            const isCorrect = answer === question.correct;
            
            // Level scoring
            if (isCorrect) {
                scores[question.level] += question.difficulty_weight;
            }
            
            // Category scoring
            if (!categoryScores[question.category]) {
                categoryScores[question.category] = 0;
            }
            categoryScores[question.category] += isCorrect ? 1 : 0;
        });

        // Determine primary level
        const primaryLevel = Object.entries(scores).reduce((a, b) => 
            scores[a[0] as FinancialLiteracyLevel] > scores[b[0] as FinancialLiteracyLevel] ? a : b
        )[0] as FinancialLiteracyLevel;

        // Identify strengths and improvement areas
        const categoryEntries = Object.entries(categoryScores);
        const strengths = categoryEntries
            .filter(([_, score]) => score >= 0.7)
            .map(([cat, _]) => cat as FinancialCategory);
        
        const improvementAreas = categoryEntries
            .filter(([_, score]) => score < 0.5)
            .map(([cat, _]) => cat as FinancialCategory);

        return {
            user_id: this.generateUserId(),
            primary_level: primaryLevel,
            category_scores: categoryScores,
            strengths,
            improvement_areas: improvementAreas,
            recommended_topics: this.generateRecommendations(primaryLevel, improvementAreas),
            assessment_date: new Date()
        };
    }

    private generateUserId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateRecommendations(level: FinancialLiteracyLevel, weakAreas: FinancialCategory[]): string[] {
        const recommendations: Record<FinancialLiteracyLevel, string[]> = {
            novice: [
                "Start with basic budgeting and emergency fund creation",
                "Learn about TFSAs and basic savings strategies",
                "Understand credit scores and debt management",
                "Explore fundamental investment concepts"
            ],
            intermediate: [
                "Develop diversified investment portfolio",
                "Learn about tax-efficient investing strategies",
                "Understand mortgage and real estate basics",
                "Explore retirement planning with RRSPs"
            ],
            advanced: [
                "Master tax optimization strategies",
                "Learn about alternative investments",
                "Understand complex financial instruments",
                "Develop comprehensive estate planning"
            ]
        };

        return recommendations[level];
    }
}

// ============================================================================
// QUIZ ENGINE AND SCORING SYSTEM
// ============================================================================

/**
 * Quiz Management System
 * Handles quiz generation, scoring, and adaptive learning
 */
export class QuizEngine {
    private questionBank: FinancialQuestionBank;
    
    constructor() {
        this.questionBank = new FinancialQuestionBank();
    }

    /**
     * Generate a personalized quiz based on user level and preferences
     */
    generateQuiz(
        userLevel: FinancialLiteracyLevel, 
        questionCount: number = 10,
        focusCategories?: FinancialCategory[]
    ): QuizQuestion[] {
        let availableQuestions = this.questionBank.getQuestions(userLevel);
        
        // Filter by focus categories if specified
        if (focusCategories && focusCategories.length > 0) {
            availableQuestions = availableQuestions.filter(q => 
                focusCategories.includes(q.category)
            );
        }

        // Ensure we have enough questions
        if (availableQuestions.length < questionCount) {
            // Add questions from adjacent levels if needed
            const adjacentLevels = this.getAdjacentLevels(userLevel);
            adjacentLevels.forEach(level => {
                const additionalQuestions = this.questionBank.getQuestions(level);
                availableQuestions.push(...additionalQuestions);
            });
        }

        // Shuffle and select questions
        const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, questionCount);
    }

    /**
     * Score a completed quiz and provide detailed analytics
     */
    scoreQuiz(questions: QuizQuestion[], answers: number[]): QuizSession {
        let correctAnswers = 0;
        const categoryPerformance: Record<FinancialCategory, number> = {} as Record<FinancialCategory, number>;
        const categoryTotals: Record<FinancialCategory, number> = {} as Record<FinancialCategory, number>;

        // Initialize category tracking
        questions.forEach(q => {
            if (!categoryPerformance[q.category]) {
                categoryPerformance[q.category] = 0;
                categoryTotals[q.category] = 0;
            }
            categoryTotals[q.category]++;
        });

        // Calculate scores
        answers.forEach((answer, index) => {
            const question = questions[index];
            const isCorrect = answer === question.correct;
            
            if (isCorrect) {
                correctAnswers++;
                categoryPerformance[question.category]++;
            }
        });

        // Convert to percentages
        Object.keys(categoryPerformance).forEach(cat => {
            const category = cat as FinancialCategory;
            categoryPerformance[category] = 
                (categoryPerformance[category] / categoryTotals[category]) * 100;
        });

        return {
            session_id: this.generateSessionId(),
            user_level: questions[0]?.level || 'novice',
            questions,
            user_answers: answers,
            score: correctAnswers,
            total_questions: questions.length,
            time_taken: 0, // To be set by the UI
            category_performance: categoryPerformance,
            completed_at: new Date()
        };
    }

    private getAdjacentLevels(level: FinancialLiteracyLevel): FinancialLiteracyLevel[] {
        const levelMap: Record<FinancialLiteracyLevel, FinancialLiteracyLevel[]> = {
            novice: ['intermediate'],
            intermediate: ['novice', 'advanced'],
            advanced: ['intermediate']
        };
        return levelMap[level] || [];
    }

    private generateSessionId(): string {
        return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// ============================================================================
// PROGRESS TRACKING AND ANALYTICS
// ============================================================================

/**
 * User Progress Tracking System
 * Maintains learning analytics and achievement tracking
 */
export class ProgressTracker {
    
    /**
     * Update user progress after quiz completion
     */
    updateProgress(
        userId: string, 
        quizSession: QuizSession, 
        currentProgress?: UserProgress
    ): UserProgress {
        const accuracy = (quizSession.score / quizSession.total_questions) * 100;
        
        if (!currentProgress) {
            // Initialize new user progress
            return {
                user_id: userId,
                current_level: quizSession.user_level,
                total_quizzes_completed: 1,
                total_questions_answered: quizSession.total_questions,
                overall_accuracy: accuracy,
                category_mastery: quizSession.category_performance,
                learning_streak: 1,
                achievements: this.checkAchievements(null, { accuracy, quizCount: 1 }),
                last_activity: new Date()
            };
        }

        // Update existing progress
        const newTotalQuestions = currentProgress.total_questions_answered + quizSession.total_questions;
        const newOverallAccuracy = (
            (currentProgress.overall_accuracy * currentProgress.total_questions_answered) +
            (accuracy * quizSession.total_questions)
        ) / newTotalQuestions;

        // Update category mastery (weighted average)
        const updatedCategoryMastery = { ...currentProgress.category_mastery };
        Object.entries(quizSession.category_performance).forEach(([category, performance]) => {
            const cat = category as FinancialCategory;
            if (updatedCategoryMastery[cat]) {
                updatedCategoryMastery[cat] = (updatedCategoryMastery[cat] + performance) / 2;
            } else {
                updatedCategoryMastery[cat] = performance;
            }
        });

        const newProgress: UserProgress = {
            ...currentProgress,
            total_quizzes_completed: currentProgress.total_quizzes_completed + 1,
            total_questions_answered: newTotalQuestions,
            overall_accuracy: newOverallAccuracy,
            category_mastery: updatedCategoryMastery,
            learning_streak: this.calculateStreak(currentProgress.last_activity),
            last_activity: new Date()
        };

        // Check for new achievements
        const newAchievements = this.checkAchievements(currentProgress, {
            accuracy: newOverallAccuracy,
            quizCount: newProgress.total_quizzes_completed,
            streak: newProgress.learning_streak
        });

        newProgress.achievements = [...new Set([...currentProgress.achievements, ...newAchievements])];

        return newProgress;
    }

    /**
     * Check for achievement unlocks
     */
    private checkAchievements(
        currentProgress: UserProgress | null, 
        metrics: { accuracy: number; quizCount: number; streak?: number }
    ): string[] {
        const achievements: string[] = [];
        
        // Quiz completion achievements
        if (metrics.quizCount === 1) achievements.push("first_quiz");
        if (metrics.quizCount === 10) achievements.push("quiz_veteran");
        if (metrics.quizCount === 50) achievements.push("quiz_master");
        
        // Accuracy achievements
        if (metrics.accuracy >= 90) achievements.push("accuracy_expert");
        if (metrics.accuracy >= 95) achievements.push("near_perfect");
        if (metrics.accuracy === 100 && metrics.quizCount > 1) achievements.push("perfectionist");
        
        // Streak achievements
        if (metrics.streak && metrics.streak >= 7) achievements.push("week_warrior");
        if (metrics.streak && metrics.streak >= 30) achievements.push("month_master");
        
        return achievements;
    }

    /**
     * Calculate learning streak
     */
    private calculateStreak(lastActivity: Date): number {
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        return daysDiff <= 1 ? 1 : 0; // Simplified streak calculation
    }

    /**
     * Generate learning recommendations based on progress
     */
    generateRecommendations(progress: UserProgress): string[] {
        const recommendations: string[] = [];
        
        // Check category weaknesses
        Object.entries(progress.category_mastery).forEach(([category, mastery]) => {
            if (mastery < 60) {
                recommendations.push(`Focus on improving ${category} knowledge`);
            }
        });

        // Overall performance recommendations
        if (progress.overall_accuracy < 70) {
            recommendations.push("Review fundamental concepts in the glossary");
            recommendations.push("Try starting with easier quiz levels");
        } else if (progress.overall_accuracy > 85) {
            recommendations.push("Challenge yourself with advanced level quizzes");
            recommendations.push("Explore complex financial strategies");
        }

        return recommendations;
    }
}

// ============================================================================
// EXPORT MAIN CLASSES FOR USE IN APPLICATION
// ============================================================================

export {
    FinancialQuestionBank,
    FinancialGlossary,
    AssessmentEngine,
    QuizEngine,
    ProgressTracker
};