/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */

function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   const { discount, sale_price, quantity } = purchase
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */

function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */

function analyzeSalesData(data, options) {
    if (!data 
        || !Array.isArray(data.sellers)
        || data.sellers.length === 0
        || !Array.isArray(data.products)
        || data.products.length === 0
        || !Array.isArray(data.purchase_records)
        || data.purchase_records.length === 0
    ) {
        throw new Error('Некорректные входные данные')
    }

    const { calculateRevenue, calculateBonus } = options

    if (calculateRevenue === undefined
        || calculateBonus === undefined
        || typeof calculateRevenue !== 'function'
        || typeof calculateBonus !== 'function'
    ) {
        throw new Error('Чего то не хватает')
    }

    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    }))

    const sellerIndex = Object.fromEntries(sellerStats.map(arr => [arr.id, arr]))
    const productIndex = Object.fromEntries(data.products.map(arr => [arr.sku, arr]))

    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id]
        seller.sales_count += 1
        seller.revenue += record.total_amount

        record.items.forEach(item => {
            const product = productIndex[item.sku]
            
        })
    })

    console.log(sellerStats)

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
