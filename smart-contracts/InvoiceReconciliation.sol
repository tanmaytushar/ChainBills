//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract InvoiceReconciliation {

    uint256 public productId;
    uint256 public productQuantity;

    constructor() {
        productId = 1; // Initialize productId to 1
        productQuantity = 1; // Initialize productQuantity to 1
    }

    function compareProducts(uint256 _productId, uint256 _productQuantity) external view returns (bool) {
        return (productId == _productId && productQuantity == _productQuantity);
    }

    function updateProduct(uint256 _newProductId, uint256 _newProductQuantity) external returns (bool) {
        productId = _newProductId;
        productQuantity = _newProductQuantity;
        return true;
    }
}
