import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Center,
  Button,
  Flex,
  Select,
  Input,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from "../Redux/ProductReducer";
import { Link } from "react-router-dom";
import Allfilters from "./Allfilters";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    product: "",
    productDetail: "",
    price: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const toast = useToast();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products
    .filter((product) =>
      product.product.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => (category ? product.category === category : true))
    .filter((product) => {
      if (price === "price1") return parseFloat(product.price) < 200;
      if (price === "price2")
        return (
          parseFloat(product.price) >= 200 && parseFloat(product.price) <= 500
        );
      if (price === "price3") return parseFloat(product.price) > 500;
      return true;
    })
    .sort((a, b) => {
      if (sort === "asc") return parseFloat(a.price) - parseFloat(b.price);
      if (sort === "desc") return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditedProduct({
      product: product.product,
      productDetail: product.productDetail,
      price: product.price,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    dispatch(updateProduct({ id: editProductId, product: editedProduct }));
    setEditProductId(null);
    toast({
      title: "Products Updated.",
      description: "Selected products have been Updated.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteClick = () => {
    selectedProducts.forEach((id) => {
      dispatch(deleteProduct(id));
    });
    setSelectedProducts([]);
    toast({
      title: "Products deleted.",
      description: "Selected products have been deleted.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box px={20} py={5} bg={"gray.50"} h={"100vh"}>
      <Flex justify="space-between" mb={4}>
        <Link to={"/addproduct"}>
          <Button colorScheme="teal" rightIcon={<AddIcon />}>
            Add Product
          </Button>
        </Link>
      </Flex>

      <Flex>
        <Box>
          <Allfilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            price={price}
            sort={sort}
            onCategoryChange={setCategory}
            onPriceChange={setPrice}
            onSortChange={setSort}
          />
        </Box>

        <Box ml={"40rem"} style={{ display: "flex" }}>
          <Select
            boxShadow={
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
            }
            value={productsPerPage}
            onChange={handleProductsPerPageChange}
            width="8rem"
          >
            <option value={5}>Product 5</option>
            <option value={10}>Product 10</option>
            <option value={15}>Product 15</option>
            <option value={20}>Product 20</option>
          </Select>

          <Button
            boxShadow={
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
            }
            bg={"red.200"}
            ml={3}
            rightIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            isDisabled={selectedProducts.length === 0}
          >
            Delete
          </Button>
        </Box>
      </Flex>

      <Center>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  isChecked={selectedProducts.length === products.length}
                  onChange={(e) =>
                    setSelectedProducts(
                      e.target.checked ? products.map((p) => p.id) : []
                    )
                  }
                  boxShadow={
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                  }
                />
              </Th>
              <Th>Products</Th>
              <Th>Quick Action</Th>
              <Th>Product Details</Th>
              <Th>Price per Unit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProducts.map((product, index) => (
              <Tr key={product.id} bg={index % 2 === 0 ? "white" : "#ECEFF1"}>
                <Td>
                  <Checkbox
                    isChecked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                    boxShadow={
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                    }
                  />
                </Td>
                <Td>
                  {editProductId === product.id ? (
                    <Input
                      name="product"
                      value={editedProduct.product}
                      onChange={handleInputChange}
                    />
                  ) : (
                    product.product
                  )}
                </Td>
                <Td>
                  {editProductId === product.id ? (
                    <Button onClick={handleSaveClick}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEditClick(product)}>
                      Quick Edit
                    </Button>
                  )}
                </Td>
                <Td>
                  {editProductId === product.id ? (
                    <Input
                      name="productDetail"
                      value={editedProduct.productDetail}
                      onChange={handleInputChange}
                    />
                  ) : (
                    product.productDetail
                  )}
                </Td>
                <Td>
                  {editProductId === product.id ? (
                    <Input
                      name="price"
                      value={editedProduct.price}
                      onChange={handleInputChange}
                    />
                  ) : (
                    product.price
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Center>
    </Box>
  );
};

export default Home;
