import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct } from "../Redux/ProductReducer";
import {
  Box,
  SimpleGrid,
  VStack,
  Heading,
  Button,
  Checkbox,
  Text,
  FormControl,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [product, setProduct] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [price, setPrice] = useState("350/kg");
  const [category, setCategory] = useState("Copper")
  const [grades, setGrades] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productNames = [
    "Aluminum Rod",
    "Stainless Steel Pipe",
    "Copper Wire",
    "Plastic Sheet",
    "Rubber Gasket",
  ];
  const productDetails = [
    "Material: aluminum, unit length: 1-3 meter, shape: rod",
    "Material: stainless steel, unit length: 2-6 meter, shape: pipe",
    "Material: copper, unit length: 100 meter roll, shape: wire",
    "Material: PVC, unit length: 2x3 meter, shape: sheet",
    "Material: rubber, unit size: 10x10 cm, shape: gasket",
  ];

  useEffect(() => {
    if (product && productDetail) {
      setGrades([
        `${product}-${productDetail}-Grade1`,
        `${product}-${productDetail}-Grade2`,
        `${product}-${productDetail}-Grade3`,
      ]);
    } else {
      setGrades([]);
    }
  }, [product, productDetail]);

  const handleGradeChange = (grade) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter((g) => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const newProduct = {
      id:
        products.length > 0
          ? Math.max(...products.map((product) => product.id)) + 1
          : 1,
      product,
      productDetail,
      price,
      category
    };
    dispatch(addProduct(newProduct))
      .then(() => {
        setLoading(false);
        toast({
          title: "Product Added",
          description: "Product added successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to add product.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Failed to add product:", error);
      });
  };

  return (
    <Center minHeight="100vh" >
      <Box
        width={{ base: "90%", md: "90rem" }}
        boxShadow="2xl"
        p={8}
        borderRadius="md"
      >
        <form onSubmit={handleSubmit}>
          <FormControl>
            <Text mb={4}>Select a product, material, and grade:</Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <VStack align="left">
                <Heading size="md">Products</Heading>
                {productNames.map((name, index) => (
                  <Button
                    key={index}
                    variant={product === name ? "solid" : "outline"}
                    colorScheme="teal"
                    onClick={() => setProduct(name)}
                  >
                    {name}
                  </Button>
                ))}
              </VStack>

              <VStack align="left">
                <Heading size="md">Materials</Heading>
                {productDetails.map((detail, index) => (
                  <Button
                    key={index}
                    variant={productDetail === detail ? "solid" : "outline"}
                    colorScheme="teal"
                    onClick={() => setProductDetail(detail)}
                  >
                    {detail}
                  </Button>
                ))}
              </VStack>

              <VStack align="left">
                <Heading size="md">Grades</Heading>
                {grades.map((grade, index) => (
                  <Checkbox
                    key={index}
                    isChecked={selectedGrades.includes(grade)}
                    onChange={() => handleGradeChange(grade)}
                  >
                    {grade}
                  </Checkbox>
                ))}
              </VStack>
            </SimpleGrid>

            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              isDisabled={loading}
            >
              Confirm
            </Button>
          </FormControl>
        </form>

        {loading && (
          <Center mt={4}>
            <Spinner size="xl" />
          </Center>
        )}
      </Box>
    </Center>
  );
};

export default AddProduct;
