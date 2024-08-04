import React from "react";
import { Input, Flex, Stack, Select } from "@chakra-ui/react";

const Allfilters = ({
  searchTerm,
  onSearchChange,
  category,
  price,
  sort,
  onCategoryChange,
  onPriceChange,
  onSortChange,
}) => {
  return (
    <>
      <Flex mb={4}>
        <Input
          boxShadow={
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          } //
          placeholder="Search products..."
          size="md"
          variant="outline"
          width="50%"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Flex>

      <Stack direction={["column", "row"]} spacing={4} mb={6}>
        <Select
          placeholder="Filter by category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          boxShadow={
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          } //
        >
          <option value="Steel">Steels</option>
          <option value="Aluminum">Aluminum</option>
          <option value="Copper">Copper</option>
          <option value="Brass">Brass</option>
          <option value="Nickel">Nickel</option>
          <option value="Titanium">Titanium</option>
          <option value="Zinc">Zinc</option>
          <option value="Lead">Lead</option>
          <option value="Plastic">Plastic</option>
          <option value="Wood">Wood</option>
        </Select>
        <Select
          boxShadow={
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          } //
          placeholder="Filter by price"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
        >
          <option value="price1">$100 - $200</option>
          <option value="price2">$300 - $500</option>
          <option value="price3">Above $500</option>
        </Select>
        <Select
          boxShadow={
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          } //
          placeholder="Sort by Price"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        //   w={'20%'}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </Select>
      </Stack>
    </>
  );
};

export default Allfilters;
