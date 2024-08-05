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
  VStack,
  HStack,
  Text,
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
  const [productsPerPage, setProductsPerPage] = useState(25);
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
      description: "Selected products have been updated.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleCancelClick = () => {
    setEditProductId(null);
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
    <Box px={20} py={5} bg={"gray.50"}>
      <Flex justify="space-between" mb={4}>
        <Link to={"/addproduct"}>
          <Button
            colorScheme="teal"
            rightIcon={<AddIcon />}
            borderRadius={"3xl"}
          >
            Add Product
          </Button>
          <Button ml={5} colorScheme="teal" borderRadius={"3xl"}>
            5 / 20 product
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
            <option value={25}>Product 25</option>
            <option value={50}>Product 50</option>
            <option value={100}>Product 100</option>
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
            // {}
          >
            Delete
          </Button>
        </Box>
      </Flex>

      <Center>
        <Table
          boxShadow={
            "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px"
          }
          mb={5}
        >
          <Thead bg={"blue.200"}>
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
              <Th color={"black"}>Products</Th>
              <Th color={"black"}>Quick Action</Th>
              <Th color={"black"}>Product Details</Th>
              <Th color={"black"}>Price per Unit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProducts.map((product) => (
              // <></>
              <React.Fragment key={product.id}>
                <Tr p={5}>
                  <Td>
                    <Checkbox
                      isChecked={selectedProducts.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                      boxShadow={
                        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                      }
                    />
                  </Td>
                  <Td>{product.product}</Td>
                  <Td
                    onClick={() => handleEditClick(product)}
                    cursor={"pointer"}
                  >
                    {/* <Button > */}
                    Quick Edit | Add Product Detials
                    {/* </Button> */}
                  </Td>
                  <Td>{product.productDetail}</Td>
                  <Td>{product.price}</Td>
                </Tr>
                {/* <hr style={{backgroundColor:'black'}}/>
                 <Divider borderColor="black" /> */}

                {editProductId === product.id && (
                  <Tr bg={"gray.100"}>
                    <Td colSpan={5}>
                      <VStack spacing={4} align="stretch">
                        <HStack spacing={10}>
                          <Box>
                            <Flex alignItems="center">
                              <Text minWidth="100px">Product:</Text>
                              <Input
                                name="product"
                                value={editedProduct.product}
                                onChange={handleInputChange}
                                boxShadow={
                                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                                }
                                style={{ borderRadius: "20px" }}
                              />
                            </Flex>
                          </Box>
                          <Box ml={5}>
                            <Flex alignItems="center">
                              <Text minWidth="100px" ml={5}>
                                Product Details:
                              </Text>
                              <Input
                                name="productDetail"
                                value={editedProduct.productDetail}
                                onChange={handleInputChange}
                                boxShadow={
                                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                                }
                                style={{
                                  borderRadius: "20px",
                                  width: "20rem",
                                  marginLeft: "20px",
                                }}
                              />
                            </Flex>
                          </Box>
                          <Box>
                            <Flex alignItems="center">
                              <Text minWidth="100px" ml={5}>
                                Price:
                              </Text>
                              <Input
                                name="price"
                                value={editedProduct.price}
                                onChange={handleInputChange}
                                boxShadow={
                                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                                }
                                style={{ borderRadius: "20px" }}
                              />
                            </Flex>
                          </Box>
                        </HStack>

                        <HStack spacing={4}>
                          <Button
                            colorScheme="teal"
                            onClick={handleSaveClick}
                            mt={5}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelClick}
                            bg={"red.100"}
                            mt={5}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      </VStack>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </Center>
    </Box>
  );
};

export default Home;
