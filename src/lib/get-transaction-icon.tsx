import Fuse from 'fuse.js'

import {
    ReceiptText,
    ShoppingBasket,
    Hotel,
    Fuel,
    Bus,
    House,
    UtilityPole,
    Utensils,
    FerrisWheel,
    HeartPulse,
    ShoppingBag,
    GraduationCap,
    Wallet,
    Landmark
} from 'lucide-react'

const iconMappings = [
    {
        icon: <ReceiptText />,
        keywords: ['test']
    },
    {
        icon: <ShoppingBasket />,
        keywords: [
            'food',
            'supermarket',
            'market',
            'shopping',
            'produce',
            'grocery store',
            "farmer's market",
            'vegetables',
            'fruits',
            'meat',
            'dairy',
            'bakery',
            'organic',
            'frozen food',
            'household supplies'
        ]
    },
    {
        icon: <House />,
        keywords: [
            'lease',
            'housing',
            'apartment',
            'mortgage',
            'home payment',
            'landlord',
            'tenant',
            'rental agreement',
            'security deposit',
            'property tax',
            'condo fees',
            'homeowners association',
            'real estate',
            'sublet',
            'moving costs'
        ]
    },
    {
        icon: <UtilityPole />,
        keywords: [
            'electricity',
            'water',
            'gas',
            'heating',
            'internet',
            'phone bill',
            'power',
            'wifi',
            'broadband',
            'cable TV',
            'sewer',
            'trash collection',
            'solar',
            'renewable energy',
            'maintenance fees'
        ]
    },
    {
        icon: <Fuel />,
        keywords: [
            'fuel',
            'gas',
            'metro',
            'taxi',
            'Uber',
            'train',
            'commute',
            'ride-sharing',
            'bicycle',
            'car rental',
            'subway',
            'public transport',
            'highway toll',
            'parking',
            'carpool',
            'automobile maintenance'
        ]
    },
    {
        icon: <Bus />,
        keywords: ['bus tickets']
    },
    {
        icon: <Utensils />,
        keywords: [
            'restaurant',
            'cafe',
            'coffee',
            'fast food',
            'takeout',
            'delivery',
            'bar',
            'pub',
            'dine-in',
            'fine dining',
            'street food',
            'buffet',
            'grill',
            'brunch',
            'food truck',
            'reservation'
        ]
    },
    {
        icon: <FerrisWheel />,
        keywords: [
            'movies',
            'Netflix',
            'games',
            'music',
            'streaming',
            'fun',
            'concert',
            'festival',
            'amusement park',
            'video games',
            'theater',
            'sports events',
            'board games',
            'virtual reality',
            'karaoke',
            'live show'
        ]
    },
    {
        icon: <HeartPulse />,
        keywords: [
            'doctor',
            'pharmacy',
            'hospital',
            'insurance',
            'medical bill',
            'clinic',
            'dentist',
            'vision care',
            'prescription',
            'mental health',
            'therapy',
            'fitness',
            'gym',
            'nutrition',
            'checkup',
            'vaccination',
            'emergency care'
        ]
    },
    {
        icon: <ShoppingBag />,
        keywords: [
            'clothes',
            'fashion',
            'electronics',
            'gadgets',
            'accessories',
            'shoes',
            'bags',
            'watches',
            'jewelry',
            'makeup',
            'beauty products',
            'home decor',
            'appliances',
            'furniture',
            'online shopping',
            'coupons',
            'sales',
            'retail'
        ]
    },
    {
        icon: <Hotel />,
        keywords: [
            'flight',
            'hotel',
            'vacation',
            'road trip',
            'trip',
            'booking',
            'airfare',
            'accommodation',
            'rental car',
            'tourist attraction',
            'cruise',
            'resort',
            'hostel',
            'backpacking',
            'passport',
            'visa',
            'luggage',
            'adventure'
        ]
    },
    {
        icon: <GraduationCap />,
        keywords: [
            'tuition',
            'school',
            'college',
            'books',
            'courses',
            'learning',
            'university',
            'online courses',
            'certifications',
            'scholarship',
            'tutoring',
            'training',
            'degree',
            'e-learning',
            'study materials',
            'exam fees',
            'student loan'
        ]
    },
    {
        icon: <Wallet />,
        keywords: [
            'loan',
            'credit card',
            'EMI',
            'mortgage',
            'interest',
            'car loan',
            'student debt',
            'personal loan',
            'bank loan',
            'repayment',
            'minimum payment',
            'balance transfer',
            'overdraft',
            'debt consolidation',
            'financial aid',
            'credit score'
        ]
    },
    {
        icon: <Landmark />,
        keywords: [
            'premium',
            'coverage',
            'health insurance',
            'auto insurance',
            'home insurance',
            'life insurance',
            'travel insurance',
            'property insurance',
            'disability insurance',
            'policy',
            'deductible',
            'claim',
            'liability',
            'broker',
            'accident coverage',
            'fire insurance'
        ]
    }
]

const fuse = new Fuse(iconMappings, {
    keys: ['keywords'],
    threshold: 0.5,
    ignoreLocation: true,
    minMatchCharLength: 3
})

export const getIcon = (query: string) => {
    const result = fuse.search(query.toLowerCase())

    return result.length > 0 ? result[0].item.icon : <ReceiptText />
}

export const transactionCategories = {
    FOOD: {
        label: 'Food',
        emoji: '🍔'
    },
    GROCERIES: {
        label: 'Groceries',
        emoji: '🛒'
    },
    ACCOMMODATION: {
        label: 'Accommodation',
        emoji: '🏠'
    },
    TRANSPORTATION: {
        label: 'Transportation',
        emoji: '🚗'
    },
    UTILITIES: {
        label: 'Utilities',
        emoji: '⚡'
    },
    ENTERTAINMENT: {
        label: 'Entertainment',
        emoji: '🎉'
    },
    SHOPPING: {
        label: 'Shopping',
        emoji: '🛍️'
    },
    TRAVEL: {
        label: 'Travel',
        emoji: '✈️'
    },
    GIFTS: {
        label: 'Gifts',
        emoji: '🎁'
    },
    HEALTH: {
        label: 'Health',
        emoji: '🏥'
    },
    FEES: {
        label: 'Fees',
        emoji: '📄'
    },
    OTHER: {
        label: 'Other',
        emoji: '📦'
    }
} as const
