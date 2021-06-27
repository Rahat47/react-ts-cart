import { useState } from "react";
import { useQuery } from "react-query";
//Components
import { Drawer, LinearProgress, Grid, Badge } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import Item from "./components/Item/Item";
//Styles
import { Wrapper } from "./app.styles";
// Types
export type CartItemType = {
    id: number;
    category: string;
    price: number;
    description: string;
    image: string;
    title: string;
    amount: number;
};
const getProducts = async (): Promise<CartItemType[]> =>
    await (await fetch("https://fakestoreapi.com/products")).json();

function App() {
    const { data, isLoading, error } = useQuery<CartItemType[]>(
        "products",
        getProducts
    );

    console.log(data);

    if (isLoading) {
        return <LinearProgress />;
    }

    if (error) {
        return <div>Something went wrong!!!</div>;
    }

    const getTotalItems = () => null;
    const handleAddToCart = (item: CartItemType) => null;
    const handleRemoveFromCart = () => null;

    return (
        <Wrapper>
            <Grid container spacing={3}>
                {data?.map(item => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <Item item={item} handleAddToCart={handleAddToCart} />
                    </Grid>
                ))}
            </Grid>
        </Wrapper>
    );
}

export default App;
