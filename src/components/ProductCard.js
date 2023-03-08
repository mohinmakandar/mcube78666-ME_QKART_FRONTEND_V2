import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import {React,useEffect} from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {


  return (
    <Card>
     <CardMedia
        component="img"
        sx={{ height: 300, width:'100%' }}
        image={product.image}
        title={product.name}
        mt={2}
      />
    <CardContent>
      <Typography gutterBottom variant="subtitle1" component="div">
        {product.name}
      </Typography>
      <Typography gutterBottom variant="h6" component="div" sx={{fontWeight: 'bold'}}>
      &#36;{product.cost}
      </Typography>
      <Typography gutterBottom variant="subtitle2" component="div">
      <Rating name="read-only" value={product.rating} readOnly />
      </Typography>
      <Button variant="contained" sx={{width: '100%'}} onClick = {(e)=>{handleAddToCart(e,product._id)}}>ADD TO CART</Button>
    </CardContent>
  </Card>
  );
};

export default ProductCard;
