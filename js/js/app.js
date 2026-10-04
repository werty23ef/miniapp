// ============================================
// 📱 ЛОГИКА ПРИЛОЖЕНИЯ
// ============================================
// Этот файл НЕ меняется при подключении сервера!
// Он просто читает данные из API и рисует экраны
// ============================================

const App = {
    currentTab: "profile",
    
    // ============================================
    // 🚀 ИНИЦИАЛИЗАЦИЯ
    // ============================================
    async init() {
        console.log("📱 Запуск мини-приложения...");
        
        // Инициализация Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
        
        // Привязываем кнопки навигации
        this.bindNavigation();
        
        // Загружаем стартовый экран
        await this.loadTab("profile");
    },

    // ============================================
    // 🔄 НАВИГАЦИЯ (вкладки)
    // ============================================
    bindNavigation() {
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    },

    switchTab(tabName) {
        // Обновляем активную кнопку
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.tab === tabName);
        });
        
        this.currentTab = tabName;
        this.loadTab(tabName);
    },

    // ============================================
    // 📥 ЗАГРУЗКА ЭКРАНА
    // ============================================
    async loadTab(tabName) {
        const container = document.getElementById("screen-container");
        
        // Показываем загрузчик
        container.innerHTML = `<div class="loader"><div class="loader-spinner"></div><div>Загрузка...</div></div>`;
        
        try {
            // Загружаем данные игрока для шапки
            const player = await API.getPlayer();
            this.updateHeader(player);
            
            // Рисуем нужный экран
            switch (tabName) {
                case "profile":
                    container.innerHTML = this.renderProfile(player);
                    break;
                case "garage":
                    const garage = await API.getGarage();
                    container.innerHTML = this.renderGarage(garage);
                    break;
                case "business":
                    const biz = await API.getBusinesses();
                    container.innerHTML = this.renderBusiness(biz);
                    break;
                case "bank":
                    const bank = await API.getBank();
                    container.innerHTML = this.renderBank(bank);
                    break;
            }
        } catch (error) {
            container.innerHTML = `<div class="error-box">❌ Ошибка загрузки данных</div>`;
            console.error("Ошибка:", error);
        }
    },

    // ============================================
    // 🎨 ОБНОВЛЕНИЕ ШАПКИ
    // ============================================
    updateHeader(player) {
        document.getElementById("user-name").textContent = player.display_name || "Магнат";
        document.getElementById("user-level").textContent = `Уровень ${player.level}`;
        document.getElementById("header-balance").textContent = this.formatMoney(player.balance_cash + player.balance_card);
    },

    // ============================================
    // 👤 ЭКРАН: ПРОФИЛЬ
    // ============================================
    renderProfile(player) {
        return `
            <div class="screen">
                <div class="profile-card">
                    <div class="profile-avatar">👤</div>
                    <div class="profile-name">${player.display_name}</div>
                    <div class="profile-username">@${player.username}</div>
                    <div class="profile-badge">🔥 В игре ${player.total_playtime_days} дней</div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">❤️</div>
                        <div class="stat-bar">
                            <div class="stat-bar-fill health" style="width:${player.health}%"></div>
                        </div>
                        <div class="stat-label">Здоровье ${player.health}%</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">😰</div>
                        <div class="stat-bar">
                            <div class="stat-bar-fill stress" style="width:${player.stress}%"></div>
                        </div>
                        <div class="stat-label">Стресс ${player.stress}%</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-bar">
                            <div class="stat-bar-fill energy" style="width:${player.energy}%"></div>
                        </div>
                        <div class="stat-label">Энергия ${player.energy}/${player.max_energy}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">${player.reputation}</div>
                        <div class="stat-label">Репутация</div>
                    </div>
                </div>
                
                <div class="info-list">
                    <div class="info-item">
                        <span class="info-label">📍 Город</span>
                        <span class="info-value">${player.city}, ${player.country}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🤝 Рефералов</span>
                        <span class="info-value">${player.referrals_count}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🖼️ Рамка</span>
                        <span class="info-value">💎 Месяц подряд</span>
                    </div>
                </div>
            </div>
        `;
    },

    // ============================================
    // 🚗 ЭКРАН: ГАРАЖ
    // ============================================
    renderGarage(garage) {
        const carsHTML = garage.cars.map(car => `
            <div class="car-card ${car.is_active ? 'active' : ''}">
                <div class="car-emoji">${car.emoji}</div>
                <div class="car-info">
                    <div class="car-name">${car.name} ${car.is_active ? '✅' : ''}</div>
                    <div class="car-details">
                        <span>⚙️ Stage ${car.tuning_stage}</span>
                        <span>📈 x${car.bonus}</span>
                    </div>
                    <div class="car-condition">
                        <div class="stat-bar">
                            <div class="stat-bar-fill ${car.condition > 60 ? 'health' : car.condition > 30 ? 'stress' : 'danger'}" 
                                 style="width:${car.condition}%"></div>
                        </div>
                        <span class="condition-text">${car.condition}% • ${car.mileage.toLocaleString()} км</span>
                    </div>
                </div>
            </div>
        `).join("");
        
        return `
            <div class="screen">
                <div class="screen-header">
                    <h2>🚗 Гараж</h2>
                    <div class="garage-slots">${garage.cars.length}/${garage.max_slots} мест</div>
                </div>
                ${carsHTML}
            </div>
        `;
    },

    // ============================================
    // 🏢 ЭКРАН: БИЗНЕСЫ
    // ============================================
    renderBusiness(biz) {
        const bizHTML = biz.businesses.map(b => `
            <div class="biz-card">
                <div class="biz-icon">${b.icon}</div>
                <div class="biz-info">
                    <div class="biz-name">${b.name}</div>
                    <div class="biz-details">
                        <span>Ур. ${b.level}</span>
                        <span class="biz-income">+${this.formatMoney(b.income_per_hour)}/ч</span>
                    </div>
                    <div class="biz-manager">
                        ${b.manager ? `🧑‍💼 ${b.manager}` : '➕ Нанять менеджера'}
                    </div>
                </div>
            </div>
        `).join("");
        
        return `
            <div class="screen">
                <div class="screen-header">
                    <h2>🏢 Бизнес-империя</h2>
                    <div class="total-income">+${this.formatMoney(biz.hourly_income)}/час</div>
                </div>
                ${bizHTML}
            </div>
        `;
    },

    // ============================================
    // 💰 ЭКРАН: БАНК
    // ============================================
    renderBank(bank) {
        const totalBalance = bank.balance_cash + bank.balance_card + bank.deposit;
        
        const transactionsHTML = bank.transactions.map(t => `
            <div class="transaction ${t.type}">
                <div class="transaction-info">
                    <div class="transaction-text">${t.text}</div>
                    <div class="transaction-time">${t.time}</div>
                </div>
                <div class="transaction-amount ${t.amount > 0 ? 'income' : 'expense'}">
                    ${t.amount > 0 ? '+' : ''}${this.formatMoney(t.amount)}
                </div>
            </div>
        `).join("");
        
        return `
            <div class="screen">
                <div class="bank-card">
                    <div class="bank-total-label">Общий капитал</div>
                    <div class="bank-total">${this.formatMoney(totalBalance)}</div>
                    <div class="bank-breakdown">
                        <div class="bank-item">
                            <span>💵 Наличные</span>
                            <span>${this.formatMoney(bank.balance_cash)}</span>
                        </div>
                        <div class="bank-item">
                            <span>💳 Карта</span>
                            <span>${this.formatMoney(bank.balance_card)}</span>
                        </div>
                        <div class="bank-item">
                            <span>🏦 Депозит (${bank.deposit_rate}%)</span>
                            <span>${this.formatMoney(bank.deposit)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="screen-header">
                    <h2>📊 История операций</h2>
                </div>
                ${transactionsHTML}
            </div>
        `;
    },

    // ============================================
    // 💸 ФОРМАТИРОВАНИЕ ДЕНЕГ
    // ============================================
    formatMoney(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + " млн ₽";
        }
        return amount.toLocaleString("ru-RU") + " ₽";
    }
};

// Запуск приложения
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
