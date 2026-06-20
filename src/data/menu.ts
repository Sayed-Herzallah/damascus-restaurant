export type MenuItem = {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  rating?: number;
};

export type MenuCategory = {
  slug: "appetizers" | "eastern" | "sandwiches" | "western" | "desserts" | "drinks";
  title_en: string;
  title_ar: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    slug: "appetizers",
    title_en: "Appetizers & Salads",
    title_ar: "المقبلات والسلطات",
    items: [
      { id: "a1", name_en: "Classic Hummus", name_ar: "حمص كلاسيكي", description_en: "Creamy pureed chickpeas with tahini, lemon juice, and virgin olive oil.", description_ar: "حمص ناعم بالطحينة والليمون وزيت الزيتون البكر.", price: 6, rating: 4.8 },
      { id: "a2", name_en: "Traditional Tabbouleh", name_ar: "تبولة شامية", description_en: "Finely chopped parsley, mint, tomatoes, and bulgur, dressed in olive oil and lemon juice.", description_ar: "بقدونس مفروم ناعم مع النعناع والطماطم والبرغل وعصير الليمون وزيت الزيتون.", price: 7, rating: 4.7 },
      { id: "a3", name_en: "Fattoush Salad", name_ar: "فتوش بلدي", description_en: "Crisp romaine, cucumber, radishes, tomatoes, and sumac-spiced crispy flatbread with pomegranate molasses.", description_ar: "سلطة مشكلة من الخيار والطماطم والفجل والنعناع والخبز المقرمش مع دبس الرمان.", price: 7, rating: 4.6 },
      { id: "a4", name_en: "Crispy Fried Kibbeh", name_ar: "كبة مقلية", description_en: "Golden cracked wheat shells stuffed with seasoned minced lamb, onions, and pine nuts.", description_ar: "أقراص البرغل المقلية والمقرمشة المحشوة باللحم المفروم المتبل والمكسرات.", price: 9, rating: 4.9 },
      { id: "a5", name_en: "Hand-rolled Vine Leaves", name_ar: "ورق عنب بالزيت", description_en: "Tender grape leaves stuffed with spiced rice, herbs, tomatoes, and olive oil.", description_ar: "أوراق عنب ملفوفة ومحشوة بالأرز المتبل والأعشاب وزيت الزيتون.", price: 8, rating: 4.8 },
    ],
  },
  {
    slug: "eastern",
    title_en: "Eastern Dishes",
    title_ar: "أطباق شرقية",
    items: [
      { id: "e1", name_en: "Royal Jameed Mansaf", name_ar: "منسف بلدي بالجميد الكركي", description_en: "Tender lamb cooked in rich fermented Jameed yogurt sauce, served on turmeric rice, decorated with almonds.", description_ar: "لحم خروف بلدي مطبوخ بجميد كركي أصيل، يُقدم فوق الأرز الأصفر المزين باللوز المقرمش.", price: 18, rating: 4.9 },
      { id: "e2", name_en: "Grand Mixed Grill", name_ar: "مشاوي مشكلة فاخرة", description_en: "Skewers of shish tawook, kafta kebab, and tender lamb chops grilled to perfection over charcoal.", description_ar: "أسياخ الشيش طاووق، كفتة لحم الغنم، وقطع اللحم المشوية على الفحم مع الخضار.", price: 22, rating: 4.8 },
      { id: "e3", name_en: "Eggplant Maqluba", name_ar: "مقلوبة باذنجان بالدجاج", description_en: "Upside-down rice layered with fried eggplant, potatoes, and tender chicken, served with yogurt.", description_ar: "أرز مبهر مطبوخ بطبقات الباذنجان والبطاطس والدجاج المطهو ببطء، يُقدم مع اللبن.", price: 16, rating: 4.7 },
      { id: "e4", name_en: "Fattet Hummus with Pine Nuts", name_ar: "فتة حمص بالصنوبر", description_en: "Layered chickpeas, toasted flatbread, garlic-infused yogurt, and melted ghee with roasted pine nuts.", description_ar: "حمص حب مسلوق مع الخبز المحمص والزبادي بالثوم والسمن البلدي الساخن والمكسرات.", price: 9, rating: 4.6 },
      { id: "e5", name_en: "Chicken Kabsa", name_ar: "كبسة دجاج سعودية", description_en: "Long-grain basmati rice cooked in rich tomato and spice broth, topped with roasted half chicken.", description_ar: "أرز بسمتي مطبوخ بمرق الطماطم الغني بالبهارات الشرقية والزبيب مع نصف دجاجة محمرة.", price: 15, rating: 4.7 },
    ],
  },
  {
    slug: "sandwiches",
    title_en: "Sandwiches",
    title_ar: "السندويشات",
    items: [
      { id: "s1", name_en: "Shawarma Chicken Wrap", name_ar: "شاورما دجاج سوبر", description_en: "Spiced chicken shawarma wrap with garlic paste, pickles, wrapped in saj bread, served with fries.", description_ar: "شاورما دجاج متبلة مع الثومية والمخلل بخبز الصاج، تُقدم مع البطاطس المقلية.", price: 6, rating: 4.8 },
      { id: "s2", name_en: "Shawarma Beef Wrap", name_ar: "شاورما لحم بخبز الصاج", description_en: "Beef shawarma wrap with onions, parsley, sumac, and tahini sauce in saj bread.", description_ar: "شاورما لحم متبلة مع البصل والبقدونس والسماق وصلصة الطحينة المميزة بخبز الصاج.", price: 7, rating: 4.7 },
      { id: "s3", name_en: "Crispy Falafel Wrap", name_ar: "لفة فلافل كلاسيكية", description_en: "Golden crispy falafel, tomatoes, cucumbers, pickled turnips, and tahini wrap in saj bread.", description_ar: "أقراص الفلافل المقرمشة، طماطم، خيار، لفت مخلل، وصلصة طحينة بخبز الصاج.", price: 5, rating: 4.5 },
      { id: "s4", name_en: "Grilled Halloumi Saj", name_ar: "صاج جبنة حلوم", description_en: "Grilled halloumi cheese with fresh mint leaves, sliced tomatoes, cucumbers, and black olives.", description_ar: "جبنة حلوم مشوية مع أوراق النعناع الطازجة، شرائح الطماطم، الخيار، والزيتون الأسود.", price: 6, rating: 4.6 },
      { id: "s5", name_en: "Kebab Saj Wrap", name_ar: "صاج كباب بلدي", description_en: "Charcoal-grilled minced meat kebab with hummus, biwaz salad, and pickles wrapped in saj bread.", description_ar: "كباب لحم مشوي على الفحم مع حمص وسلطة بيواز ومخلل ملفوف بخبز الصاج.", price: 8, rating: 4.7 },
    ],
  },
  {
    slug: "western",
    title_en: "Western Meals",
    title_ar: "وجبات غربية",
    items: [
      { id: "w1", name_en: "Premium Ribeye Steak", name_ar: "ستيك ريب آي فاخر", description_en: "Grilled ribeye steak (300g) served with garlic mashed potatoes, roasted vegetables, and herb butter.", description_ar: "ستيك لحم ريب آي مشوي (300 جم) يُقدم مع بطاطس مهروسة بالثوم وخضار سوتيه وزبدة الأعشاب.", price: 28, rating: 4.9 },
      { id: "w2", name_en: "Margherita Pizza", name_ar: "بيتزا مارجريتا نابوليتان", description_en: "Fresh house-made tomato sauce, fresh buffalo mozzarella, fresh basil, and extra virgin olive oil.", description_ar: "صلصة الطماطم المحضرة منزلياً، موزاريلا بوفالو طازجة، أوراق ريحان، وزيت زيتون بكر.", price: 14, rating: 4.4 },
      { id: "w3", name_en: "Gourmet Caesar Salad", name_ar: "سلطة سيزر بالدجاج", description_en: "Romaine lettuce, grilled chicken breast, herb croutons, parmesan flakes, and creamy Caesar dressing.", description_ar: "خس روماني، صدر دجاج مشوي، خبز محمص بالأعشاب، بارميزان، وصلصة السيزر الكريمية.", price: 10, rating: 4.5 },
      { id: "w4", name_en: "Truffle Tagliatelle Pasta", name_ar: "باستا الكمأة الإيطالية", description_en: "Fresh tagliatelle pasta in a luxurious creamy black truffle and wild mushroom sauce, with parmesan.", description_ar: "معكرونة التالياتيلي الطازجة بصلصة الكريمة الغنية والكمأة السوداء الفاخرة وجبن البارميزان.", price: 17, rating: 4.8 },
      { id: "w5", name_en: "Creamy Chicken Alfredo", name_ar: "باستا ألفريدو بالدجاج الفطر", description_en: "Fettuccine pasta in rich butter, garlic and cream Alfredo sauce, topped with sliced grilled chicken breast.", description_ar: "فيتوتشيني بصلصة ألفريدو الكريمية الثرية بالزبدة والثوم مع قطع الدجاج المشوية والفطر.", price: 15, rating: 4.6 },
    ],
  },
  {
    slug: "desserts",
    title_en: "Desserts",
    title_ar: "الحلويات الشرقية والغربية",
    items: [
      { id: "d1", name_en: "Nabulsia Kunafa", name_ar: "كنافة نابلسية خشنة بالجبن", description_en: "Hot shredded pastry layered with sweet melted cheese, soaked in orange blossom syrup, with pistachios.", description_ar: "عجينة كنافة ذهبية ومقرمشة محشوة بالجبن العكاوي الذائب، تُسقى بالقطر الدافئ وتزين بالفستق.", price: 8, rating: 4.9 },
      { id: "d2", name_en: "Layali Lubnan", name_ar: "حلوى ليالي لبنان الفاخرة", description_en: "Cold semolina pudding flavored with mastic, topped with fresh cream, honey, and crushed pistachios.", description_ar: "بودنج السميد البارد بنكهة المستكة، مغطى بطبقة من القشطة البلدية والعسل والفستق الحلبي.", price: 7, rating: 4.7 },
      { id: "d3", name_en: "Royal Baklava Selection", name_ar: "تشكيلة بقلاوة ملكية", description_en: "Platter of crispy puff pastry layers filled with chopped walnuts, pistachios, and sweetened with light syrup.", description_ar: "طبق من طبقات الرقائق الهشة المقرمشة المحشوة بالفستق والكاجو والجوز والمحلاة بالقطر الخفيف.", price: 9, rating: 4.8 },
      { id: "d4", name_en: "Traditional Umm Ali", name_ar: "أم علي بالمكسرات والقشطة", description_en: "Baked puff pastry soaked in sweetened warm milk, cream, coconut flakes, raisins, and roasted nuts.", description_ar: "رقائق الخبز المخبوزة بالحليب الساخن والمحلاة، مع الكريمة الطازجة والزبيب وجوز الهند والمكسرات.", price: 8, rating: 4.7 },
    ],
  },
  {
    slug: "drinks",
    title_en: "Drinks & Beverages",
    title_ar: "المشروبات العصائر",
    items: [
      { id: "dr1", name_en: "Fresh Mint Lemonade", name_ar: "ليمون بالنعناع طازج", description_en: "Refreshing blend of fresh lemon juice, crushed ice, and organic mint leaves.", description_ar: "عصير الليمون الطبيعي البارد والمخفوق مع الثلج المجروش وأوراق النعناع الطازجة.", price: 5, rating: 4.8 },
      { id: "dr2", name_en: "Traditional Arabic Coffee", name_ar: "قهوة عربية بالهيل", description_en: "Authentic Arabic coffee brewed with fresh cardamom pods, served in traditional cups.", description_ar: "قهوة عربية أصيلة معدة من حبوب البن المحمصة مع الهيل الأخضر، تُقدم بالدلة التقليدية.", price: 4, rating: 4.9 },
      { id: "dr3", name_en: "Levantine Mint Tea", name_ar: "شاي إبريق بالنعناع", description_en: "Hot brewed red tea served in a traditional teapot with fresh mint leaves and sugar.", description_ar: "شاي أحمر ساخن محضر بالدلة مع أوراق النعناع الطازجة، يُقدم بالأسلوب الشامي الأصيل.", price: 4, rating: 4.7 },
      { id: "dr4", name_en: "Fresh Orange Juice", name_ar: "عصير برتقال طبيعي", description_en: "100% natural, freshly squeezed orange juice served chilled.", description_ar: "عصير برتقال طبيعي طازج ومعصور يومياً، يُقدم بارداً وصحياً.", price: 5, rating: 4.6 },
    ],
  },
];
