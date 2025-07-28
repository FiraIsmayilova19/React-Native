import React, { useState } from 'react';
import { Alert, FlatList, SafeAreaView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

interface Product {
  name: string;
  price: number;
}

interface SectionData {
  title: string;
  data: Product[];
}

const categories = ['Şirniyyat', 'Un Məmulatları', 'İçki', 'Süd Məhsulları'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [cart, setCart] = useState<Product[]>([]);

  const handleAddProduct = () => {
    if (!name || !price) {
      Alert.alert('Xəta', 'Məhsulun adı və qiyməti boş ola bilməz');
      return;
    }

    const newProduct: Product = { name, price: parseFloat(price) };
    const updated = { ...products };

    if (!updated[selectedCategory]) {
      updated[selectedCategory] = [];
    }

    updated[selectedCategory].push(newProduct);
    setProducts(updated);
    setName('');
    setPrice('');
  };

  const handleRemoveProduct = (category: string, index: number) => {
    const updated = { ...products };
    updated[category].splice(index, 1);
    setProducts(updated);
  };

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
    Alert.alert('Əlavə olundu', `${product.name} səbətə əlavə olundu`);
  };

  const sectionListData: SectionData[] = Object.keys(products).map((key) => ({
    title: key,
    data: products[key],
  }));

  const totalPrice = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🛒 Səbətdə: {cart.length} məhsul / {totalPrice} AZN</Text>

      <View style={styles.categories}>
        <FlatList
          data={categories}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Məhsul adı"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Qiymət"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          onSubmitEditing={handleAddProduct}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Əlavə et</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sectionListData}
        keyExtractor={(item, index) => item.name + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <View style={styles.productItem}>
            <View>
              <Text style={styles.productText}>{item.name}</Text>
              <Text>{item.price} AZN</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.plus}>+ Əlavə et</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveProduct(section.title, index)}
              >
                <Text style={styles.deleteText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categories: {
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  selectedCategory: {
    backgroundColor: '#cde',
  },
  categoryText: {
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  productItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 10,
    backgroundColor: '#28a745',
    padding: 6,
    borderRadius: 6,
  },
  plus: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    fontSize: 16,
  },
});
