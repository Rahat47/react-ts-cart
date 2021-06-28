import { useState } from "react";
import { useQuery } from "react-query";
//Components
import { Drawer, LinearProgress, Grid, Badge } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import Item from "./components/Item/Item";
//Styles
import { StyledButton, Wrapper } from "./app.styles";
import Cart from "./components/cart/Cart";
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
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[]);

    const { data, isLoading, error } = useQuery<CartItemType[]>(
        "products",
        getProducts
    );

    if (isLoading) {
        return <LinearProgress />;
    }

    if (error) {
        return <div>Something went wrong!!! </div>;
    }

    const getTotalItems = (items: CartItemType[]) =>
        items.reduce((acc: number, item: CartItemType) => acc + item.amount, 0);

    const handleAddToCart = (item: CartItemType) => {
        setCartItems(prev => {
            const isItemInCart = prev.find(el => el.id === item.id);

            if (isItemInCart) {
                return prev.map(el =>
                    el.id === item.id ? { ...el, amount: el.amount + 1 } : el
                );
            }

            return [...prev, { ...item, amount: 1 }];
        });
    };

    const handleRemoveFromCart = (id: number) => {
        setCartItems(prev =>
            prev.reduce((acc, item) => {
                if (item.id === id) {
                    if (item.amount === 1) return acc;
                    return [...acc, { ...item, amount: item.amount - 1 }];
                } else {
                    return [...acc, item];
                }
            }, [] as CartItemType[])
        );
    };

    return (
        <Wrapper>
            <Drawer
                anchor="right"
                open={cartOpen}
                onClose={() => setCartOpen(false)}
            >
                <Cart
                    cartItems={cartItems}
                    addToCart={handleAddToCart}
                    removeFromCart={handleRemoveFromCart}
                />
            </Drawer>

            <StyledButton onClick={() => setCartOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color="error">
                    <AddShoppingCart />
                </Badge>
            </StyledButton>

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
