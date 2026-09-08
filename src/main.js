/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */

function calculateSimpleRevenue(purchase, _product) {
   const { discount, sale_price, quantity } = purchase
   const discountRate = 1 - (discount / 100)
   return (sale_price * quantity) * discountRate
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */

function calculateBonusByProfit(index, total, seller) {
    const { profit } = seller

    if (index === 0) {
        return profit * 0.15
    }   else if (index === 1 || index === 2) {
        return profit * 0.10
    }   else if (index === total - 1) {
        return 0
    }   else {
        return profit * 0.05
    }
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
            const cost = product.purchase_price * item.quantity
            const revenue = calculateRevenue(item, product) - cost
            seller.profit += revenue

            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0
            }
            seller.products_sold[item.sku] += 1
        })
    })

    sellerStats.sort((a, b) => b.profit - a.profit)

    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonusByProfit(index, sellerStats.length, seller)
        seller.top_products = 
            Object.entries(seller.products_sold)
                .map(([key, value]) => ({sku: key, purchases: value}))
                    .sort((a, b) => b.purchases - a.purchases)
                        .slice(0, 10)
    })

    return sellerStats.map(seller => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: +seller.revenue.toFixed(2),
        profit: +seller.profit.toFixed(2),
        sales_count: seller.sales_count,
        top_products: seller.top_products,
        bonus: +seller.bonus.toFixed(2)
    }))
}
