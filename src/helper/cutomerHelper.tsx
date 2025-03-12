export function templateGroupByCategory(templateItems:any) {
    return templateItems.reduce((grouped:any, item:any) => {
      const categoryId = item.template_category_id;
      
      // Initialize array if category does not exist
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      
      // Add item to its respective category
      grouped[categoryId].push(item);
      
      return grouped;
    }, {});
  }
  interface Category {
    name?: string;
    type?: string;
    categoryId?: number;
    category_name?: string;
    items?: any[];
    template_name?: string;
    template_type?: string;
  }
  export function groupTemplateItemsByCategory(data:any) {
    const groupedItems: { [key: string]: Category } = {}
  
    // Iterate over each entry in the data array
    data.forEach((entry:any) => {
      if (entry.template && entry.template.template_item) {
        const templateName = entry.template.name;
        const templateType = entry.template.type;
  
        entry.template.template_item.forEach((item:any) => {
          const categoryId = item.template_category_id;
          const categoryName = item.template_category ? item.template_category.name : "Unknown";
          // Initialize an object for each category if it doesn't exist
          if (!groupedItems[categoryId]) {
            groupedItems[categoryId] = {
              name: templateName,
              type: templateType,
              categoryId:categoryId,
              category_name: categoryName,
              items: []
            };
          }
  
          // Add the item to its respective category's items array
          // (groupedItems[categoryId] ?? {}).items.push(item);
        });
      }
    });
  
    return Object.values(groupedItems);
  }
  
  

  export function newGroupTemplateItemsByCategory(templateData:any) {
    const groupedItems: { [key: string]: Category } = {}
    if (templateData.template_item) {
      const templateName = templateData.name;
      const templateType = templateData.type;
      templateData.template_item.forEach((item:any) => {
        const categoryId = item.template_category_id;
        const categoryName = item.template_category ? item.template_category.name : "Unknown";
        if (!groupedItems[categoryId]) {
          groupedItems[categoryId] = {
            template_name: templateName,
            template_type: templateType,
            category_name: categoryName,
            items: []
          };
        }
  
        // Add the item to its respective category's items array
        (groupedItems[categoryId]?.items ?? []).push({
          id: item.id,
          value_1: item.value_1,
          value_2: item.value_2,
          value_3: item.value_3,
          is_comment: item.is_comment,
        });
      });
    }
  
    return Object.values(groupedItems);
  }