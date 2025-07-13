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
  // Scroll container reference
  const scrollContainerRef = useRef(null);
  // Saved scroll position reference
  const savedScrollPosition = useRef(0);
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
  // Undo click tracking
  const [undoClickCount, setUndoClickCount] = useState(0);
  const undoClickTimer = useRef(null);

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

    const loadSelectedItems = async () => {
      try {
        const storedSelectedItems = await storage.load({
          key: 'selectedItems',
        });
        
        if (storedSelectedItems) {
          setSelectedItems(storedSelectedItems);
          setIsListDirty(true);
        }
      } catch (error) {
        console.log('No stored selected items found');
      }
    };

    const loadSelectedItemsHistory = async () => {
      try {
        const storedHistory = await storage.load({
          key: 'selectedItemsHistory',
        });
        
        if (storedHistory && Array.isArray(storedHistory)) {
          setSelectedItemsHistory(storedHistory);
        }
      } catch (error) {
        console.log('No stored selected items history found');
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
            { "Gatorade": ["Red", "Lime", "Orange", "Blue","Mix"] },
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
            { "Magnum": ["2x Choc", "Almond", "Caramel", "Peanut B.", "Cookie D.","Raspberry"] },
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
    loadSelectedItems();
    loadSelectedItemsHistory();
  }, []);

  useEffect(() => {
    if (isListDirty) { 
      formatFoodList();
      setIsListDirty(false);
      
      // Restore scroll position after list formatting is complete
      setTimeout(() => {
        if (scrollContainerRef.current && savedScrollPosition.current > 0) {
          scrollContainerRef.current.scrollTop = savedScrollPosition.current;
        }
      }, 0);
    }
  }, [isListDirty])

  // Save selected items to storage whenever they change
  useEffect(() => {
    const saveSelectedItems = async () => {
      try {
        await storage.save({
          key: 'selectedItems',
          data: selectedItems,
          expires: null,
        });
      } catch (error) {
        console.error('Error saving selected items:', error);
      }
    };

    saveSelectedItems();
  }, [selectedItems]);

  // Save selected items history to storage whenever it changes
  useEffect(() => {
    const saveSelectedItemsHistory = async () => {
      try {
        await storage.save({
          key: 'selectedItemsHistory',
          data: selectedItemsHistory,
          expires: null,
        });
      } catch (error) {
        console.error('Error saving selected items history:', error);
      }
    };

    saveSelectedItemsHistory();
  }, [selectedItemsHistory]);

  const toggleListType = () => {
    setIsTomorrowList(!isTomorrowList);
  };

  const handleLongPressItem = (item) => {
    // Save current scroll position before opening edit modal
    savedScrollPosition.current = scrollContainerRef.current?.scrollTop || 0;
    
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
        
        // Restore scroll position after edit modal closes
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = savedScrollPosition.current;
          }
        }, 0);
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
      
      // Restore scroll position after delete
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedScrollPosition.current;
        }
      }, 0);
    };

    const handleChangeEditInput = (event) => {
      setEditedItemName(event.target.value);
    };

    const handleModalClick = (e) => {
      if (e.target === e.currentTarget) {
        setEditModalVisible(false);
        
        // Restore scroll position when edit modal is dismissed
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = savedScrollPosition.current;
          }
        }, 0);
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

    // Get available positions based on selected category and subcategory
    const getAvailablePositions = () => {
      if (!selectedCategory) return [];
      
      const category = coloredCategories.find(cat => cat.category === selectedCategory);
      if (!category) return [];

      if (selectedSubcategory) {
        const subCategoryItem = category.items.find(
          item => typeof item === 'object' && Object.keys(item)[0] === selectedSubcategory
        );
        if (subCategoryItem) {
          const subItems = subCategoryItem[selectedSubcategory];
          return [
            { value: 0, label: `At beginning` },
            ...subItems.map((item, index) => ({
              value: index + 1,
              label: `After "${item}"`
            }))
          ];
        }
      } else {
        return [
          { value: 0, label: `At beginning of ${selectedCategory}` },
          ...category.items.map((item, index) => {
            const itemName = typeof item === 'object' ? Object.keys(item)[0] : item;
            return {
              value: index + 1,
              label: `After "${itemName}"`
            };
          })
        ];
      }
      return [];
    };

    const handleAddItem = () => {
      if (newItemInput.trim() !== '') {
        // Save current scroll position
        const currentScrollPosition = scrollContainerRef.current?.scrollTop || 0;
        
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
                  ? selectedInsertIndex
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

          // Restore scroll position after state update
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = currentScrollPosition;
            }
          }, 0);
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
        
        // Restore scroll position when add modal is dismissed
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = savedScrollPosition.current;
          }
        }, 0);
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

          <select 
            className={styles.dropdown}
            value={selectedInsertIndex || ''}
            onChange={(e) => setSelectedInsertIndex(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">At end (default)</option>
            {getAvailablePositions().map(position => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>

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
    const handleAddButtonClick = () => {
      // Save current scroll position before opening add modal
      savedScrollPosition.current = scrollContainerRef.current?.scrollTop || 0;
      setIsModalVisible(true);
    };

    return (
      <button 
        className={`${styles.floatingButton} ${styles.addButton}`}
        onClick={handleAddButtonClick}
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

    // Save current scroll position in ref before opening modal
    savedScrollPosition.current = scrollContainerRef.current?.scrollTop || 0;
    
    setColor(itemColor); 
    setSelectedItem(foodName);
    setModalVisible(true);
    
    // Immediately restore scroll position to prevent any jump when modal opens
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = savedScrollPosition.current;
      }
    }, 0);
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
      // Save current scroll position before opening edit modal
      savedScrollPosition.current = scrollContainerRef.current?.scrollTop || 0;
      
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
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
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
                        onItemPress={() => handleItemPress(`${brand} ${subcategory}`, item.color)}
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
      
      // Restore scroll position after modal closes using saved position
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedScrollPosition.current;
        }
      }, 0);
    };

    const handleCloseModal = () => {
      setModalVisible(false);
      
      // Restore scroll position after modal closes using saved position
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedScrollPosition.current;
        }
      }, 0);
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
        <div className={styles.modalView} style={{ maxHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
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
          <div className={styles.modalList} style={{ 
            overflowY: 'auto', 
            flex: 1, 
            maxHeight: 'calc(30vh - 80px)', 
            padding: '10px',
            
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{formattedList}</pre>
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
          text: message,
        });
      } else {
        await navigator.clipboard.writeText(message);
        alert('Food list copied to clipboard!');
      }

      // Clear the selected items and history after successful sharing
      setSelectedItems({});
      setSelectedItemsHistory([]);
      setIsListDirty(true);
      
      // Clear from storage as well
      try {
        await storage.save({
          key: 'selectedItems',
          data: {},
          expires: null,
        });
        await storage.save({
          key: 'selectedItemsHistory',
          data: [],
          expires: null,
        });
      } catch (error) {
        console.error('Error clearing selected items from storage:', error);
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

    // Track rapid undo clicks
    setUndoClickCount(prev => prev + 1);
    
    // Clear the timer if it exists
    if (undoClickTimer.current) {
      clearTimeout(undoClickTimer.current);
    }
    
    // Set a timer to reset the count after 2 seconds
    undoClickTimer.current = setTimeout(() => {
      setUndoClickCount(0);
    }, 2000);
    
    // If user clicked undo 4 times rapidly, offer to clear the list
    if (undoClickCount >= 4) {
      if (confirm('You\'ve clicked undo multiple times. Would you like to clear the entire food list?')) {
        setSelectedItems({});
        setSelectedItemsHistory([]);
        setIsListDirty(true);
        setUndoClickCount(0);
        
        // Clear from storage as well
        storage.save({
          key: 'selectedItems',
          data: {},
          expires: null,
        }).then(() => {
          storage.save({
            key: 'selectedItemsHistory',
            data: [],
            expires: null,
          });
        }).catch(error => {
          console.error('Error clearing selected items from storage:', error);
        });
        
        return;
      } else {
        setUndoClickCount(0);
      }
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
      
      // Clear from storage as well
      storage.save({
        key: 'selectedItems',
        data: {},
        expires: null,
      }).then(() => {
        storage.save({
          key: 'selectedItemsHistory',
          data: [],
          expires: null,
        });
      }).catch(error => {
        console.error('Error clearing selected items from storage:', error);
      });
    }
  };

  const formatFoodList = () => {
    const orderedItems = [];
    const groupedCategories = {};
    const processedGroups = new Set();

    // First pass: identify grouped items and preserve order
    for (const [originalItemName, quantity] of Object.entries(selectedItems)) {
      if (quantity > 0) {
        const parts = originalItemName.split(' ');
        let brand = parts[0];
        let subcategory = parts.slice(1).join(' ');

        // Check if this item belongs to Ice Cream category
        const isIceCreamItem = filteredFoodItems.some(
          (category) =>
            category.category === 'Ice Cream' &&
            (category.items.includes(originalItemName) ||
             category.items.some(
               (item) =>
                 typeof item === 'object' && Object.keys(item)[0] === brand
             ))
        );

        // Check if this is a subcategory item (has both brand and subcategory)
        const isSubcategoryItem = filteredFoodItems.some(
          (category) =>
            category.items.some(
              (item) =>
                typeof item === 'object' && Object.keys(item)[0] === brand
            )
        );

        if (isSubcategoryItem && subcategory) {
          // This is a subcategory item (ice cream or non-ice cream)
          if (!groupedCategories[brand]) {
            groupedCategories[brand] = {};
          }
          groupedCategories[brand][subcategory] = quantity;

          // Add to ordered list only if this brand hasn't been processed yet
          if (!processedGroups.has(brand)) {
            orderedItems.push({ type: 'group', brand: brand, isIceCream: isIceCreamItem });
            processedGroups.add(brand);
          }
        } else {
          // This is a regular item (ice cream or non-ice cream)
          orderedItems.push({ type: 'item', name: originalItemName, quantity: quantity, isIceCream: isIceCreamItem });
        }
      }
    }

    // Format the final list maintaining order
    let formattedListArray = [];
    let iceCreamHeaderAdded = false;
    
    for (const item of orderedItems) {
      // Add Ice Cream header when we encounter the first ice cream item
      if (item.isIceCream && !iceCreamHeaderAdded) {
        formattedListArray.push('Ice Cream:');
        iceCreamHeaderAdded = true;
      }

      if (item.type === 'group') {
        const brand = item.brand;
        const subcategories = groupedCategories[brand];
        
        if (subcategories && Object.keys(subcategories).length > 0) {
          // Check if this is a beverage category that should use pack logic
          const isBeverageCategory = filteredFoodItems.some(
            (category) =>
              category.category === 'Beverages' &&
              category.items.some(
                (subItem) =>
                  typeof subItem === 'object' && Object.keys(subItem)[0] === brand
              )
          );

          // Add appropriate indentation for ice cream items
          const brandIndent = item.isIceCream ? '  ' : '';
          formattedListArray.push(`${brandIndent}${brand}:`);

          if (isBeverageCategory) {
            // Use pack logic for beverages with quantities > 3
            const packItems = {};
            const regularItems = {};

            for (const [subcategory, quantity] of Object.entries(subcategories)) {
              if (quantity > 3) {
                packItems[subcategory] = quantity;
              } else {
                regularItems[subcategory] = quantity;
              }
            }

            // Add regular subcategory items first
            for (const [subcategory, quantity] of Object.entries(regularItems)) {
              const itemIndent = item.isIceCream ? '    ' : '  ';
              formattedListArray.push(`${itemIndent}${subcategory}-${quantity}`);
            }

            // Add pack items
            const packEntries = Object.entries(packItems);
            if (packEntries.length > 0) {
              // Group pack items into 24-count packs
              const packGroups = [{}];
              let currentPackIndex = 0;

              for (const [subcategory, quantity] of packEntries) {
                let remainingQuantity = quantity;

                while (remainingQuantity > 0) {
                  const currentPack = packGroups[currentPackIndex];
                  const currentPackTotal = Object.values(currentPack).reduce((sum, qty) => sum + qty, 0);
                  const availableSpace = 24 - currentPackTotal;
                  const amountToAdd = Math.min(remainingQuantity, availableSpace);

                  if (amountToAdd > 0) {
                    const abbreviation = subcategory
                      .split(' ')
                      .filter(word => word !== "Can")
                      .map((word) => word[0].toUpperCase())
                      .join('');

                    currentPack[abbreviation] = (currentPack[abbreviation] || 0) + amountToAdd;
                    remainingQuantity -= amountToAdd;
                  }

                  if (remainingQuantity > 0 && availableSpace === 0) {
                    packGroups.push({});
                    currentPackIndex++;
                  }
                }
              }

              // Format pack groups
              packGroups.forEach((packContent) => {
                const formattedPackItems = Object.entries(packContent)
                  .filter(([initial, qty]) => qty > 0)
                  .map(([initial, qty]) => `${initial}-${qty}`)
                  .join('+');

                if (formattedPackItems !== "") {
                  const itemIndent = item.isIceCream ? '    ' : '  ';
                  formattedListArray.push(`${itemIndent}(${formattedPackItems})-1`);
                }
              });
            }
          } else {
            // Regular subcategory grouping for non-beverages
            for (const [subcategory, quantity] of Object.entries(subcategories)) {
              const itemIndent = item.isIceCream ? '    ' : '  ';
              formattedListArray.push(`${itemIndent}${subcategory}-${quantity}`);
            }
          }
        }
      } else {
        // Regular item
        const itemIndent = item.isIceCream ? '  ' : '';
        formattedListArray.push(`${itemIndent}${item.name}-${item.quantity}`);
      }
    }

    setFormattedList(formattedListArray.join('\n'));
    return formattedListArray.join('\n');
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
