'use client'

import storage from './Storage';
import SearchBar from './SearchBar';
import { useState, useEffect, useRef, memo } from 'react';
import styles from './FoodList.module.css';
import Image from 'next/image';

var colors = ['#C40C0C', '#FF6500', '#FF8A08', '#FFC100', '#00CC66', '#0A6847', '#7ABA78', '#756AB6', '#FF5BAE', '#6C3428', '#00224D'];

function getColor() {
  if (colors.length === 0) {
    colors = ['#C40C0C', '#FF6500', '#FF8A08', '#FFC100', '#00CC66', '#0A6847', '#7ABA78', '#756AB6', '#FF5BAE', '#6C3428', '#00224D'];
  }
  var index = Math.floor(Math.random() * colors.length);
  var color = colors[index];
  colors.splice(index, 1);
  return color;
}

const FoodList = ({ filteredFoodItems, setFilteredFoodItems, showInterstitialAd}) => {
  // Modal visibility state
  const [modalVisible, setModalVisible] = useState(false); 
  // Selected item state
  const [selectedItem, setSelectedItem] = useState(null);
  // Color state
  const [color, setColor] = useState(null);
  // Selected items state
  const [selectedItems, setSelectedItems] = useState({}); 
  // Formatted list state
  const [formattedList, setFormattedList] = useState([]); 
  // Colored categories state
  const [coloredCategories, setColoredCategories] = useState([]);
  // Input reference
  const inputRef = useRef(null);
  // Search history state
  const [searchHistory, setSearchHistory] = useState([]);
  // Is list dirty state
  const [isListDirty, setIsListDirty] = useState(true); 
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  // Selected items history state
  const [selectedItemsHistory, setSelectedItemsHistory] = useState([]);
  // Is modal visible state
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Button opacity
  const [buttonOpacity, setButtonOpacity] = useState(1);
  // Edit modal visibility state
  const [editModalVisible, setEditModalVisible] = useState(false);
  // Editing item state
  const [editingItem, setEditingItem] = useState(null);
  // Edit input reference
  const editInputRef = useRef(null);
  // Edited item name state
  const [editedItemName, setEditedItemName] = useState('');
  // Is loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isTomorrowList, setIsTomorrowList] = useState(true);

  const resetStorage = async () => {
    try {
      localStorage.removeItem('foodItems');
      console.log('Storage reset successfully');
    } catch (error) {
      console.error('Error resetting storage:', error);
    }
  };

  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        const storedItems = await storage.load({
          key: 'foodItems',
        });
        
        if (storedItems && storedItems.length > 0) {
          setFilteredFoodItems(storedItems);
          setColoredCategories(storedItems);
        } else {
          initializeFoodItems();
        }
      } catch (error) {
        console.error('Error loading food items:', error);
        initializeFoodItems(); 
      } finally {
        setIsLoading(false);
      }
    };

    const initializeFoodItems = () => {
      var foodData = [
        {
          "category": "Food",
          "items": [
            "Hot Dog",
            "Corn Dog",
            "Sausage",
            "Bread",
            "Churros",
            { "Pretzel": ["Regular", "Cheese"] },
          ],
          "color": "#000000"
        },
        {
          "category": "Beverages",
          "items": [
            "Water",
            "Small Water",
            "Sparkling Water",
            "Vitamin Water",
            "Red Bull",
            { "Gatorade": ["Red", "Lime", "Orange", "Blue"] },
            { "Snapple": ["Peach", "Lemon", "Kiwi", "Diet Peach", "Diet Lemon"] },
            { "Soda": ["Coke", "Diet Coke", "Sprite", "Lemonade", "Fanta", "Pepsi", "Coke Zero", "Diet Pepsi"] },
            { "Can": ["Coke", "Diet Coke", "Sprite", "Fanta"] },
          ],
          "color": "#000000"
        },
        {
          "category": "Ice Cream",
          "items": [
            "Oreo Bar",
            "Klondike",
            "Strawberry Shortcake",
            "Vanilla Bar",
            "Giant Vanilla",
            "Chocolate Chip",
            "Cookie Sandwich",
            "Choc Éclair",
            "King Kone",
            "Birthday Cake",
            "Original",
            "Reeses",
            { "Popsicle": ["Spiderman","Spongebob","Spacejam","Sonic","Batman","Bomb Pop","Ninja Turtle", "Snowcone",] },
            { "FrozFruit": ["Strawberry", "Coconut", "Mango", "Lime", "Pineapple"] },
            { "Magnum": ["2x Choc", "Almond", "Caramel", "Peanut B.", "Cookie D."] },
            { "Häagen-Dazs": ["Almond", "Dark C.", "Coffee A."] },
            {"Cup": ["Lemonade", "Strawberry"]}
          ],
          "color": "#000000"
        },
        {
          "category": "Nuts",
          "items": ["Peanuts", "Cashews", "Almonds", "Pecans"],
          "color": "#000000"
        },
        {
          "category": "Miscellaneous",
          "items": [
            "Onions",
            "Sauerkraut",
            "Mustard",
            "Ketchup",
            "Sterno",
            "Napkins",
            "Roll Towels",
            "Gloves",
            "Straws",
            "Foil",
            "Spoons",
            "Sugar",
            "Vanillin",
            "Dry Ice",
            "Regular Ice",
            "Garbage Bags",
            "White Bags",
            "Brown Bags",
            "Black Bags"
          ],
          "color": "#000000"
        }
      ].map((category) => ({
        ...category,
        color: getColor(), 
      }))
      
      setFilteredFoodItems(foodData);
      setColoredCategories(foodData);
    };

    loadFoodItems();
  }, []);

  useEffect(() => {
    if (isListDirty) { 
      formatFoodList();
      setIsListDirty(false);
    }
  }, [isListDirty])

  const toggleListType = () => {
    setIsTomorrowList(!isTomorrowList);
  };

  const handleLongPressItem = (item) => {
    setEditingItem(item);
    setEditedItemName(item);
    setEditModalVisible(true);
  };

  const EditModal = () => {
    useEffect(() => {
      if (editModalVisible && editInputRef.current) {
        setTimeout(() => {
          editInputRef.current.focus();
        }, 100);
      }
    }, [editModalVisible]);

    const handleSaveEdit = () => {
      if (editedItemName.trim() !== '') {
        setFilteredFoodItems(prevItems => {
          const updatedItems = prevItems.map(category => {
            return {
              ...category,
              items: category.items.map(foodItem => {
                if (typeof foodItem === 'string' && foodItem === editingItem) {
                  return editedItemName;
                } else if (typeof foodItem === 'object' && typeof editingItem === 'string') {
                  const [key, values] = Object.entries(foodItem)[0];
                  const updatedValues = values.map(subItem => 
                    subItem === editingItem ? editedItemName : subItem 
                  );
                  return { [key]: updatedValues }; 
                } else {
                  return foodItem;
                }
              }),
            };
          });

          storage.save({
            key: 'foodItems',
            data: updatedItems,
            expires: null,
          }).then(() => {
            setColoredCategories(updatedItems);
            console.log('Food items saved to storage after editing');
          }).catch(error => {
            console.error('Error saving food items to storage after editing:', error);
          });

          return updatedItems;
        });

        setEditingItem(null);
        setEditModalVisible(false);
      }
    };

    const handleDeleteItem = () => {
      setFilteredFoodItems((prevItems) => {
        const updatedFoodItems = prevItems.map((category) => {
          return {
            ...category,
            items: category.items.reduce((acc, item) => {
              if (typeof item === 'string') {
                if (item !== editingItem) {
                  acc.push(item);
                }
              } else if (typeof item === 'object') {
                const [subcatName, subcatItems] = Object.entries(item)[0];
                const updatedSubItems = subcatItems.filter(subItem => subItem !== editingItem); 

                if (updatedSubItems.length > 0) {
                  acc.push({ [subcatName]: updatedSubItems }); 
                }
              } else {
                acc.push(item); 
              }
              return acc;
            }, []),
          };
        });

        storage.save({
          key: 'foodItems',
          data: updatedFoodItems,
          expires: null,
        }).then(() => {
          setColoredCategories(updatedFoodItems);
          console.log('Food items saved to storage after deleting item');
        }).catch(error => {
          console.error('Error saving food items to storage after deleting item:', error);
        });

        return updatedFoodItems;
      });

      setEditingItem(null);
      setEditModalVisible(false);
    };

    const handleChangeEditInput = (event) => {
      setEditedItemName(event.target.value);
    };

    const handleModalClick = (e) => {
      if (e.target === e.currentTarget) {
        setEditModalVisible(false);
      }
    };

    if (!editModalVisible) return null;

    return (
      <div className={styles.centeredView} onClick={handleModalClick}>
        <div className={styles.editModalView}>
          <h3 className={styles.modalText}>{editingItem}</h3>
          <input
            className={styles.EditInput}
            value={editedItemName}
            onChange={handleChangeEditInput}
            ref={editInputRef}
            placeholder="Enter new item name"
          />
          <div className={styles.buttonContainer}>
            <button
              className={styles.saveButton} 
              onClick={handleSaveEdit}
            >
              <span className={styles.textStyle}>Save</span>
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteItem}
            >
              <Image src="/trash-icon.png" alt="Delete" width={25} height={25} className={styles.trashIcon} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const itemExists = (arr, newItem) => {
    try {
      return arr.some(item => {
        if (typeof item === 'string' && typeof newItem === 'string') {
          return item === newItem;
        } else if (typeof item === 'object' && typeof newItem === 'object') {
          const [[key1, values1]] = Object.entries(item);
          const [[key2, values2]] = Object.entries(newItem);
          return key1 === key2 && JSON.stringify(values1) === JSON.stringify(values2);
        }
        return false;
      });
    } catch (error) {
      console.error('Error in itemExists:', error);
      return false;
    }
  };

  const AddModal = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newItemInput, setNewItemInput] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedInsertIndex, setSelectedInsertIndex] = useState(null);

    useEffect(() => {
      if (filteredFoodItems && filteredFoodItems.length > 0) {
        setSelectedCategory(filteredFoodItems[0].category);
      }
    }, [filteredFoodItems]);

    const handleAddItem = () => {
      if (newItemInput.trim() !== '') {
        // Find the category in coloredCategories (the source of truth)
        const categoryIndex = coloredCategories.findIndex(
          (item) => item.category === selectedCategory
        );

        if (categoryIndex !== -1) {
          const updatedColoredCategories = [...coloredCategories];
          const categoryToUpdate = updatedColoredCategories[categoryIndex];

          if (categoryToUpdate && categoryToUpdate.items) {
            if (selectedSubcategory) {
              const subCategoryItem = categoryToUpdate.items.find(
                (item) =>
                  typeof item === 'object' &&
                  Object.keys(item)[0] === selectedSubcategory
              );

              if (subCategoryItem) {
                const subItems = [...subCategoryItem[selectedSubcategory]];
                const insertAt =
                  selectedInsertIndex !== null
                    ? selectedInsertIndex
                    : subItems.length;
                subItems.splice(insertAt, 0, newItemInput);

                categoryToUpdate.items = categoryToUpdate.items.map((item) => {
                  if (
                    typeof item === 'object' &&
                    Object.keys(item)[0] === selectedSubcategory
                  ) {
                    return { [selectedSubcategory]: subItems };
                  } else {
                    return item;
                  }
                });
              } else {
                console.warn(
                  `Subcategory '${selectedSubcategory}' not found in category '${selectedCategory}'`
                );
              }
            } else {
              const insertAt =
                selectedInsertIndex !== null
                  ? selectedInsertIndex - 1
                  : categoryToUpdate.items.length;
              categoryToUpdate.items.splice(insertAt, 0, newItemInput);
            }
          } else {
            console.warn(`'items' array not found in category '${categoryToUpdate?.category || selectedCategory}'`);
          }

          // Update both states synchronously
          setColoredCategories(updatedColoredCategories);
          
          // If there's an active search, re-apply it, otherwise use the full list
          if (searchQuery.trim() === '') {
            setFilteredFoodItems([...updatedColoredCategories]);
          } else {
            // Re-apply search filter to updated data
            const filteredItems = updatedColoredCategories.map((category) => {
              const matchingItems = category.items.filter((item) => {
                if (typeof item === 'object') {
                  const [subcatName, subcatItems] = Object.entries(item)[0];
                  return subcatName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         subcatItems.some(subItem => subItem.toLowerCase().includes(searchQuery.toLowerCase()));
                } else {
                  return item.toLowerCase().includes(searchQuery.toLowerCase());
                }
              });

              if (matchingItems.length > 0) {
                return { ...category, items: matchingItems };
              } else {
                return null;
              }
            }).filter(Boolean);
            setFilteredFoodItems(filteredItems);
          }

          // Save to storage
          storage.save({
            key: 'foodItems',
            data: updatedColoredCategories,
            expires: null,
          }).then(() => {
            console.log('Food items saved to storage');
          }).catch(error => {
            console.error('Error saving food items to storage:', error);
          });
        } 

        setNewItemInput('');
        setIsModalVisible(false);
        setSelectedSubcategory(null); 
        setSelectedInsertIndex(null);
      }
    };

    const handleModalClick = (e) => {
      if (e.target === e.currentTarget) {
        setIsModalVisible(false);
      }
    };

    if (!isModalVisible) return null;

    return (
      <div className={styles.modalContainer} onClick={handleModalClick}>
        <div className={styles.modalContent}>
          <select 
            className={styles.dropdown}
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {filteredFoodItems.map(item => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>

          {selectedCategory && (
            <select 
              className={styles.dropdown}
              value={selectedSubcategory || ''}
              onChange={(e) => setSelectedSubcategory(e.target.value || null)}
            >
              <option value="">Select subcategory (optional)</option>
              {filteredFoodItems
                .find(item => item.category === selectedCategory)
                ?.items.filter(item => typeof item === 'object')
                .map(item => {
                  const key = Object.keys(item)[0];
                  return (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  );
                })}
            </select>
          )}

          <input
            className={styles.AddInput}
            placeholder="Enter new item"
            value={newItemInput}
            onChange={(e) => setNewItemInput(e.target.value)}
          />
          <button className={styles.AddButton} onClick={handleAddItem}>
            <span className={styles.textStyle}>Add Item</span>
          </button>
        </div>
      </div>
    );
  };

  const AddButton = () => {
    return (
      <button 
        className={`${styles.floatingButton} ${styles.addButton}`}
        onClick={() => setIsModalVisible(true)}
        style={{ opacity: buttonOpacity }}
      >
        <Image src="/add-icon.png" alt="Add" width={25} height={25} className={styles.addButtonIcon} />
      </button>
    );
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredFoodItems([...coloredCategories]); 
    } else {
      const filteredItems = coloredCategories.map((category) => {
        const matchingItems = category.items.filter((item) => {
          if (typeof item === 'object') {
            const [subcatName, subcatItems] = Object.entries(item)[0];
            return subcatName.toLowerCase().includes(query.toLowerCase()) || 
                   subcatItems.some(subItem => subItem.toLowerCase().includes(query.toLowerCase()));
          } else {
            return item.toLowerCase().includes(query.toLowerCase());
          }
        });

        if (matchingItems.length > 0) {
          return { ...category, items: matchingItems };
        } else {
          return null;
        }
      }).filter(Boolean);

      setFilteredFoodItems(filteredItems);
    }
  };

  const handleGoBackInSearch = () => {
    setSearchHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, -1);
      const previousQuery = newHistory[newHistory.length - 1] || '';

      setSearchQuery(previousQuery);
      handleSearchChange(previousQuery);

      return newHistory;
    });
  };

  const handleItemPress = (food, itemColor) => {
    const foodName = typeof food === 'object' ? Object.keys(food)[0] : food;
    console.log(foodName)

    setColor(itemColor); 
    setSelectedItem(foodName);
    setModalVisible(true);
  }; 

  const FoodItem = memo(({ food, color, onItemPress, onItemLongPress, style, onEditPress}) => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      onItemLongPress && onItemLongPress();
    };

    return ( 
      <div
        className={`${styles.itemContainer} ${style || ''}`}
        style={{ backgroundColor: color }}
        onClick={onItemPress}
        onContextMenu={handleContextMenu}
      >
        <div className={styles.itemContentContainer}> 
          <span className={styles.item}>{typeof food === 'object' ? Object.keys(food)[0] : food}</span>
          <button onClick={(e) => {e.stopPropagation(); onEditPress();}} className={styles.editButton}>
            <Image src="/edit-icon.png" alt="Edit" width={30} height={30} className={styles.editIcon} />
          </button>
        </div>
      </div>
    );
  }); 

  const FoodFlatList = () => {
    const handleEditPress = (foodItem) => {
      let itemToEdit = foodItem;

      if (typeof foodItem === 'object') {
        const [subcategoryKey, subcategoryValues] = Object.entries(foodItem)[0];
        itemToEdit = subcategoryValues.find(subItem => subItem === editingItem);
      }

      console.log("Edit item:", itemToEdit);
      setEditingItem(itemToEdit);
      setEditedItemName(itemToEdit);
      setEditModalVisible(true);
    };

    return (
      <div className={styles.scrollContainer}>
        {filteredFoodItems.map((item, categoryIndex) => (
          <div key={`${item.category}-${categoryIndex}`}>
            <h2 className={styles.category} style={{ color: item.color, borderColor: item.color }}>
              {item.category}
            </h2>

            {item.items.map((food, index) => {
              const foodKey = typeof food === 'object'
                ? `${item.category}-${Object.keys(food)[0]}`
                : `${item.category}-${food}`;

              if (typeof food === 'object') {
                const [brand, subcategories] = Object.entries(food)[0];

                return (
                  <div key={foodKey}>
                    <h3 className={styles.brand} style={{ color: item.color }}>{brand}</h3>
                    {subcategories.map((subcategory, subIndex) => ( 
                      <FoodItem
                        key={`${foodKey}-${subIndex}`}
                        food={subcategory} 
                        color={item.color}
                        onItemPress={() => handleItemPress(`${subcategory} ${brand}`, item.color)}
                        onItemLongPress={() => handleLongPressItem(subcategory)}
                        style={styles.subItemContainer}
                        onEditPress={() => handleEditPress(subcategory)}
                      />
                    ))}
                  </div>
                );

              } else {
                return (
                  <FoodItem
                    key={foodKey} 
                    food={food}
                    color={item.color}
                    onItemPress={() => handleItemPress(food, item.color)}
                    onItemLongPress={() => handleLongPressItem(food)}
                    style=""
                    onEditPress={() => handleEditPress(food)}
                  />
                );
              }
            })}
          </div>
        ))}
      </div>
    );
  };

  const QuantityModal = () => {
    const [quantity, setQuantity] = useState('');
    const [isValidQuantity, setIsValidQuantity] = useState(false);

    useEffect(() => {
      if (modalVisible && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
          // Trigger click to ensure mobile number pad opens
          inputRef.current.click();
        }, 300); 
      }
    }, [modalVisible]);

    const handleConfirm = () => {
      const numQuantity = parseInt(quantity);
      if (!quantity || numQuantity <= 0 || isNaN(numQuantity) || quantity.includes('.')) {
        setIsValidQuantity(false);
        return;
      } else {
        setIsValidQuantity(true);
      }
      console.log(`Selected ${quantity} of ${selectedItem}`);
      
      setModalVisible(false);
      setSelectedItems((prevItems) => ({
        ...prevItems,
        [selectedItem]: numQuantity,
      }));
      setSelectedItemsHistory((prevHistory) => [...prevHistory, { ...selectedItems }]);
      setIsListDirty(true); 
    };

    const handleCloseModal = () => {
      setModalVisible(false);
    };

    const handleChangeQuantity = (event) => {
      const value = event.target.value;
      if (!value || parseInt(value) <= 0 || isNaN(value) || value.includes('.') || value.includes(' ')) {
        setIsValidQuantity(false);
        setQuantity(value);
        return;
      }
      setIsValidQuantity(true);
      setQuantity(value);
    };

    const handleModalClick = (e) => {
      if (e.target === e.currentTarget) {
        handleConfirm();
        handleCloseModal();
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleConfirm();
      }
    };

    if (!modalVisible) return null;

    return (
      <div className={styles.centeredView} onClick={handleModalClick}>
        <div className={styles.modalView}>
          <p className={styles.modalText}>
            How much{' '}
            <span style={{ fontWeight: 'bold', color: color}}>
              {selectedItem}
            </span>
            ?
          </p>
          <input
            className={styles.input}
            style={{ borderColor: color }}
            onChange={handleChangeQuantity}
            value={quantity}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            max="99"
            min="1"
            onBlur={handleConfirm}
            onKeyPress={handleKeyPress}
            ref={inputRef}
            autoFocus
            placeholder="0"
          />
          <div className={styles.buttonContainer}>
            <button
              className={isValidQuantity ? styles.button : styles.buttonError}
              style={isValidQuantity ? { backgroundColor: color } : {}}
              onClick={handleConfirm}
            >
              <span className={styles.textStyle}>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FormattedListModal = () => {
    return (
      <div className={`${styles.bottomSheetContainer} ${styles.expanded}`}>
        <div className={styles.modalView}>
          <div className={styles.modalHeader}>
            <label className={styles.switchContainer}>
              <input
                type="checkbox"
                checked={isTomorrowList}
                onChange={toggleListType}
                className={styles.switch}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={styles.modalTitle}>
              {isTomorrowList ? "Tomorrow's List:" : "Today's List:"}
            </span>
          </div>
          <div className={styles.modalList}>
            <pre>{formattedList}</pre>
          </div>
        </div>
      </div>
    );
  };

  const shareFoodList = async () => {
    try {
      await showInterstitialAd();
      let message = formattedList;

      if (isTomorrowList) {
        message = "Tomorrow's List\n" + message;
      } else {
        message = "Today's List\n" + message;
      }

      if (navigator.share) {
        await navigator.share({
          title: 'Food List',
          text: message,
        });
      } else {
        await navigator.clipboard.writeText(message);
        alert('Food list copied to clipboard!');
      }
    } catch (error) {
      alert('Empty Food List. Add food items before sharing.');
    }
  };

  const ShareListButton = () => {
    return (
      <button
        className={`${styles.floatingButton} ${styles.shareButton}`}
        onClick={shareFoodList}
        style={{ opacity: buttonOpacity }}
      >
        <Image
          src="/share-icon.png"
          alt="Share"
          width={25}
          height={25}
          className={styles.floatingButtonIcon}
        />
      </button>
    );
  };

  const UndoButton = () => {
    return (
      <button
        className={`${styles.floatingButton} ${styles.undoButton}`}
        onClick={handleUndo}
        onContextMenu={handleUndoLongPress}
        style={{ opacity: buttonOpacity }}
      >
        <Image
          src="/undo-icon.png"
          alt="Undo"
          width={25}
          height={25}
          className={styles.undoButtonIcon}
        />
      </button>
    );
  };

  const handleUndo = () => {
    if (selectedItemsHistory.length === 0) {
      alert('Nothing to Undo. You haven\'t added any items yet.');
      return;
    }

    const previousState = selectedItemsHistory[selectedItemsHistory.length - 1];
    setSelectedItems(previousState);
    setSelectedItemsHistory(selectedItemsHistory.slice(0, -1));
    setIsListDirty(true); 
  };

  const handleUndoLongPress = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to clear the entire food list?')) {
      setSelectedItems({}); 
      setSelectedItemsHistory([]);
      setIsListDirty(true); 
    }
  };

  const formatFoodList = () => {
    const formattedItems = {};

    for (const [originalItemName, quantity] of Object.entries(selectedItems)) {
      if (quantity > 0) {
        const parts = originalItemName.split(' ');
        let brand = parts.slice(-1)[0];
        let subcategory = parts.slice(0, -1).join(' ');
        let itemName = originalItemName;

        let categoryName = subcategory ? subcategory : brand;
      
        itemName = subcategory;
        categoryName = brand; 

        if (
          filteredFoodItems.some(
            (category) =>
              category.category === 'Beverages' &&
              category.items.some(
                (item) =>
                  typeof item === 'object' && Object.keys(item)[0] === categoryName 
              )
          )
        ) {
          if (quantity > 3) {
            formattedItems[categoryName] = formattedItems[categoryName] || { Pack: [{}] };

            let currentPackIndex = 0;
            let quantityCopy = quantity;

            while (quantityCopy > 0) {
              const currentPack = formattedItems[categoryName].Pack[currentPackIndex];

              let currentPackTotal = Object.values(currentPack).reduce(
                (sum, qty) => sum + qty,
                0
              );

              const availableSpace = 24 - currentPackTotal;
              const amountToAdd = Math.min(quantityCopy, availableSpace);

              if (amountToAdd > 0) {
                const abbreviation = itemName
                  .split(' ')
                  .filter(word => word !== "Can")
                  .map((word) => word[0].toUpperCase())
                  .join('.');

                currentPack[abbreviation] = (currentPack[abbreviation] || 0) + amountToAdd;
                quantityCopy -= amountToAdd;
              }

              if (quantityCopy > 0 && availableSpace === 0) {
                formattedItems[categoryName].Pack.push({});
                currentPackIndex++;
              }

              if (quantityCopy === 0) {
                break;
              }
            }
          } else {
            formattedItems[originalItemName] = quantity;
          }
        } else if (categoryName === "FrozFruit") {
          formattedItems[`${brand} ${subcategory}`] = quantity;
        } 
        else {
          formattedItems[originalItemName] = quantity;
        }
      }
    }

    let formattedListArray = [];
    for (const [brandOrItem, quantityData] of Object.entries(formattedItems)) {
      if (typeof quantityData === 'object' && quantityData.Pack) {
        formattedListArray.push(`${brandOrItem}:`);

        let packString = "";
        quantityData.Pack.forEach((packContent, index) => {
          const formattedPackItems = Object.entries(packContent)
            .filter(([initial, qty]) => qty > 0)
            .map(([initial, qty]) => `${initial}-${qty}`)
            .join('+');

          if (formattedPackItems !== "") {
            packString += `(${formattedPackItems})-1`;
            if (index < quantityData.Pack.length - 1) {
              packString += "\n";
            }
          }
        });

        if (packString !== "") {
          formattedListArray.push(`\n${packString}`);
        }
        formattedListArray.push('\n');
      } else {
        formattedListArray.push(`${brandOrItem}-${quantityData}\n`);
      }
    }

    setFormattedList(formattedListArray.join(''));
    return formattedListArray.join('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <SearchBar onSearchChange={handleSearchChange} onGoBackInSearch={handleGoBackInSearch} /> 
      <FoodFlatList />
      <QuantityModal />
      <AddModal />
      <FormattedListModal />
      <EditModal />
      <AddButton />
      <UndoButton /> 
      <ShareListButton />
    </div>
  );
};

export default FoodList;
