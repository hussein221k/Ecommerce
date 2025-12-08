
const categories = ["ملابس", "إكسسوارات", "إلكترونيات", "ديكور منزل", "أحذية", "أثاث"];

export const products = Array.from({ length: 72 }, (_, i) => {
    const id = i + 1;
    const imageParams = String(id).padStart(4, "0");
    const category = categories[i % categories.length];

    return {
        id: id,
        name: `منتج رقم ${id}`,
        price: 29.99 + (i * 5),
        description: `هذا وصف توضيحي للمنتج رقم ${id}. يتم استخدامه لتوضيح شكل وتصميم المتجر الإلكتروني ونظام العرض الجديد.`,
        image: `/images/IMG-20251206-WA${imageParams}.jpg`,
        category: category,
        sizes: ["S", "M", "L", "XL"],
        rating: 4.0 + (id % 10) / 10,
        reviews: [
            {
                user: "مستخدم تجريبي",
                comment: "هذا المنتج يبدو رائعاً في التصميم الجديد!",
                rating: 5
            }
        ]
    };
});
