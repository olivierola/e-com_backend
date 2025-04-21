const { pool } = require('../config/db');
const { getDeepseekResponse } = require('../config/deepseek');

exports.chatWithAI = async (req, res, next) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'La requête est requise' });
    }
    
    // Get available products to contextualize recommendations
    const [products] = await pool.query(`
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.price, 
        p.categoryId,
        c.name as categoryName,
        GROUP_CONCAT(CONCAT(pc.name, ': ', pc.value) SEPARATOR '; ') as characteristics
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN product_characteristics pc ON p.id = pc.productId
      WHERE p.stock > 0
      GROUP BY p.id
      LIMIT 100
    `);
    
    // Prepare products context for the AI
    const productsContext = products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.categoryName,
      characteristics: p.characteristics
    }));
    
    // Build prompt for Deepseek
    const prompt = `
      Je cherche des recommandations de produits basées sur cette requête: "${query}".
      
      Voici les produits disponibles:
      ${JSON.stringify(productsContext)}
      
      Suggère-moi 3 à 5 produits qui correspondent le mieux à ma requête.
      Donne-moi une réponse au format JSON avec cette structure:
      {
        "recommendations": [
          {
            "productId": 123,
            "title": "Nom du produit",
            "reason": "Raison de la recommandation basée sur ma requête"
          }
        ],
        "message": "Un message personnalisé expliquant les recommandations"
      }
    `;
    
    // Call Deepseek API
    const aiResponse = await getDeepseekResponse(prompt);
    
    // Parse the response (assuming the model returns properly formatted JSON)
    let recommendations;
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.choices[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Format JSON non trouvé dans la réponse');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback to a manually constructed response
      recommendations = {
        recommendations: products.slice(0, 3).map(p => ({
          productId: p.id,
          title: p.title,
          reason: "Produit recommandé par le système"
        })),
        message: "Voici quelques produits qui pourraient vous intéresser"
      };
    }
    
    // Fetch full product details for the recommendations
    const productIds = recommendations.recommendations.map(r => r.productId);
    
    if (productIds.length > 0) {
      const [detailedProducts] = await pool.query(`
        SELECT id, title, description, price, images
        FROM products
        WHERE id IN (${productIds.join(',')})
      `);
      
      // Enrich recommendations with detailed product data
      recommendations.recommendations = recommendations.recommendations.map(rec => {
        const productDetail = detailedProducts.find(p => p.id === rec.productId);
        return {
          ...rec,
          ...productDetail,
          images: productDetail?.images ? JSON.parse(productDetail.images) : []
        };
      });
    }
    
    res.json({
      query,
      ...recommendations
    });
    
  } catch (error) {
    console.error('Chat AI error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la communication avec l\'IA',
      query: req.body.query,
      recommendations: []
    });
  }
};