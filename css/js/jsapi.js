// ============================================
// 🔌 СЛОЙ ДАННЫХ (API LAYER)
// ============================================
// СЕЙЧАС: тестовые данные
// ПОТОМ: заменим на реальные запросы к серверу
// ВСЕ экраны читают данные ТОЛЬКО отсюда!
// ============================================

const API = {
    
    // Флаг: тестовый режим или реальный сервер
    USE_TEST_DATA: true,  // ← Потом поменяем на false
    
    // Адрес сервера (пока не используется)
    SERVER_URL: "http://YOUR_SERVER_IP:8000",

    // ============================================
    // 👤 ПОЛУЧИТЬ ДАННЫЕ ИГРОКА
    // ============================================
    async getPlayer() {
        if (this.USE_TEST_DATA) {
            // 🧪 ТЕСТОВЫЕ ДАННЫЕ
            return {
                user_id: 123456789,
                display_name: "Александр",
                username: "alex_magnate",
                level: 12,
                balance_cash: 250000,      // наличные
                balance_card: 1000000,     // карта
                bank_deposit: 500000,      // депозит
                energy: 80,
                max_energy: 100,
                health: 95,
                stress: 20,
                reputation: 100,
                referrals_count: 5,
                city: "Ижевск",
                country: "Россия",
                active_frame: "streak_30",
                total_playtime_days: 45
            };
        } else {
            // 🖥️ РЕАЛЬНЫЙ СЕРВЕР (потом)
            const response = await fetch(`${this.SERVER_URL}/api/player/${this.getUserId()}`);
            return await response.json();
        }
    },

    // ============================================
    // 🚗 ПОЛУЧИТЬ ГАРАЖ
    // ============================================
    async getGarage() {
        if (this.USE_TEST_DATA) {
            // 🧪 ТЕСТОВЫЕ ДАННЫЕ
            return {
                garage_level: 3,
                max_slots: 6,
                cars: [
                    {
                        id: 1,
                        name: "BMW M5",
                        bonus: 1.35,
                        tuning_stage: 2,
                        color: "Матовый чёрный",
                        condition: 85,
                        mileage: 12400,
                        is_active: true,
                        emoji: "🚗"
                    },
                    {
                        id: 2,
                        name: "Mercedes G-Class",
                        bonus: 1.20,
                        tuning_stage: 1,
                        color: "Белоснежный глянец",
                        condition: 62,
                        mileage: 34100,
                        is_active: false,
                        emoji: "🚙"
                    },
                    {
                        id: 3,
                        name: "Lada Priora",
                        bonus: 1.05,
                        tuning_stage: 3,
                        color: "Кровавый металлик",
                        condition: 30,
                        mileage: 98700,
                        is_active: false,
                        emoji: "🚘"
                    }
                ]
            };
        } else {
            const response = await fetch(`${this.SERVER_URL}/api/garage/${this.getUserId()}`);
            return await response.json();
        }
    },

    // ============================================
    // 🏢 ПОЛУЧИТЬ БИЗНЕСЫ
    // ============================================
    async getBusinesses() {
        if (this.USE_TEST_DATA) {
            // 🧪 ТЕСТОВЫЕ ДАННЫЕ
            return {
                hourly_income: 45000,
                businesses: [
                    {
                        id: 1,
                        name: "Автомойка",
                        icon: "🚿",
                        income_per_hour: 5000,
                        level: 3,
                        manager: "Тони"
                    },
                    {
                        id: 2,
                        name: "Шаурмичная",
                        icon: "🌯",
                        income_per_hour: 2000,
                        level: 5,
                        manager: null
                    },
                    {
                        id: 3,
                        name: "IT-компания",
                        icon: "💻",
                        income_per_hour: 38000,
                        level: 2,
                        manager: "Хакер Алекс"
                    }
                ]
            };
        } else {
            const response = await fetch(`${this.SERVER_URL}/api/businesses/${this.getUserId()}`);
            return await response.json();
        }
    },

    // ============================================
    // 💰 ПОЛУЧИТЬ БАНК
    // ============================================
    async getBank() {
        if (this.USE_TEST_DATA) {
            // 🧪 ТЕСТОВЫЕ ДАННЫЕ
            return {
                balance_cash: 250000,
                balance_card: 1000000,
                deposit: 500000,
                deposit_rate: 8.5,
                credit_limit: 0,
                credit_used: 0,
                transactions: [
                    { id: 1, type: "income", amount: 50000, text: "Дивиденды", time: "2 часа назад" },
                    { id: 2, type: "expense", amount: -15000, text: "Бар", time: "5 часов назад" },
                    { id: 3, type: "income", amount: 120000, text: "Зарплата", time: "вчера" }
                ]
            };
        } else {
            const response = await fetch(`${this.SERVER_URL}/api/bank/${this.getUserId()}`);
            return await response.json();
        }
    },

    // ============================================
    // 🔧 ПОЛУЧИТЬ ID ПОЛЬЗОВАТЕЛЯ ИЗ TELEGRAM
    // ============================================
    getUserId() {
        try {
            if (window.Telegram && window.Telegram.WebApp) {
                const user = window.Telegram.WebApp.initDataUnsafe.user;
                return user ? user.id : 0;
            }
        } catch (e) {}
        return 0;
    },

    // ============================================
    // 📤 ОТПРАВИТЬ ДЕЙСТВИЕ НА СЕРВЕР (потом)
    // ============================================
    async sendAction(action, data = {}) {
        if (this.USE_TEST_DATA) {
            // 🧪 В тестовом режиме просто логируем
            console.log("🧪 Тестовое действие:", action, data);
            return { success: true, message: "Тестовый режим" };
        } else {
            const response = await fetch(`${this.SERVER_URL}/api/action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, data, user_id: this.getUserId() })
            });
            return await response.json();
        }
    }
};