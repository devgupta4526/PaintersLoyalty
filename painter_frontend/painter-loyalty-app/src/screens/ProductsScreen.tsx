import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService } from '../services/api';

interface Props {
  navigation: ProductsScreenNavigationProp;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  inStock: boolean;
  points: number; // Points earned for selling this product
}

type ProductsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Products'>;
type ProductsScreenRouteProp = RouteProp<RootStackParamList, 'Products'>;

interface Props {
  navigation: ProductsScreenNavigationProp;
  route: ProductsScreenRouteProp;
}

export default function ProductsScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const renderProductCard = (product: Product) => (
    <View key={product.id} style={styles.productCard}>
      {product.image && (
        <Image source={{ uri: product.image }} style={styles.productImage} />
      )}
      <View style={styles.productContent}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.productDetails}>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{product.price}</Text>
            <Text style={styles.pointsText}>+{product.points} points</Text>
          </View>

          <View style={[
            styles.stockBadge,
            { backgroundColor: product.inStock ? '#28a745' : '#dc3545' }
          ]}>
            <Text style={styles.stockText}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        <Text style={styles.categoryText}>{product.category}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
      </View>

      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.activeCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.activeCategoryButtonText
              ]}>
                {category === 'all' ? 'All Products' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading products...</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedCategory === 'all' ? 'No products available' : `No products in ${selectedCategory}`}
            </Text>
          </View>
        ) : (
          filteredProducts.map(renderProductCard)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryFilter: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeCategoryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productContent: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pointsText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  stockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
});