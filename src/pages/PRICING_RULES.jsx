const PRICING_RULES = {
  "Estampado": { threshold: 10, discount: 0.20 }, // 20% descuento a partir de 10
  "Bordado": { threshold: 10, discount: 0.25 },   // 25% descuento a partir de 10
  "DTF": { threshold: 10, discount: 0.15 },       // 15% descuento a partir de 50
  "Bordado en Remeras": { threshold: 10, discount: 0.20},
  "DTF en Buzos": { threshold: 10, discount: 0.20}
};

export default PRICING_RULES;