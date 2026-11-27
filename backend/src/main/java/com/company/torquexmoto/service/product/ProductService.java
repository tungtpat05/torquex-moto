package com.company.torquexmoto.service.product;

import com.company.torquexmoto.dto.product.request.ProductCreateRequest;
import com.company.torquexmoto.dto.product.request.ProductUpdateRequest;
import com.company.torquexmoto.dto.product.response.ProductResponse;
import com.company.torquexmoto.dto.product.response.ProductSpecificationResponse;
import com.company.torquexmoto.dto.product.response.ProductVariantResponse;
import com.company.torquexmoto.entity.product.Brand;
import com.company.torquexmoto.entity.product.Category;
import com.company.torquexmoto.entity.product.Product;
import com.company.torquexmoto.exception.ResourceNotFoundException;
import com.company.torquexmoto.mapper.product.ProductMapper;
import com.company.torquexmoto.mapper.product.ProductSpecificationMapper;
import com.company.torquexmoto.mapper.product.ProductVariantMapper;
import com.company.torquexmoto.repository.product.ProductRepository;
import com.company.torquexmoto.repository.product.ProductSpecificationRepository;
import com.company.torquexmoto.repository.product.ProductVariantRepository;
import com.company.torquexmoto.service.storage.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final BrandService brandService;
    private final CategoryService categoryService;
    private final ProductMapper productMapper;
    private final ProductVariantMapper productVariantMapper;
    private final ProductSpecificationMapper productSpecificationMapper;
    private final ImageStorageService imageStorageService;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAll() {
        return enrichProducts(productRepository.findAll());
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return enrichProducts(List.of(product)).get(0);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getByCategoryId(Integer categoryId) {
        return enrichProducts(productRepository.findByCategoryId(categoryId));
    }

    private List<ProductResponse> enrichProducts(List<Product> products) {
        if (products.isEmpty()) {
            return List.of();
        }

        List<Integer> productIds = products.stream().map(Product::getId).toList();

        Map<Integer, List<ProductVariantResponse>> variantsByProduct = productVariantRepository
                .findByProductIdIn(productIds)
                .stream()
                .map(productVariantMapper::toResponse)
                .collect(Collectors.groupingBy(ProductVariantResponse::getProductId));

        Map<Integer, List<ProductSpecificationResponse>> specsByProduct = productSpecificationRepository
                .findByProductIdInOrderBySpecDefinitionDisplayOrderAsc(productIds)
                .stream()
                .map(productSpecificationMapper::toResponse)
                .collect(Collectors.groupingBy(ProductSpecificationResponse::getProductId));

        return products.stream().map(product -> {
            ProductResponse response = productMapper.toResponse(product);
            response.setVariants(variantsByProduct.getOrDefault(product.getId(), List.of()));
            response.setSpecifications(specsByProduct.getOrDefault(product.getId(), List.of()));
            return response;
        }).toList();
    }

    public ProductResponse create(ProductCreateRequest request) {
        Product product = productMapper.toEntity(request);

        // Set brand if provided
        if (request.getBrandId() != null) {
            Brand brand = brandService.getEntityById(request.getBrandId());
            product.setBrand(brand);
        }

        // Set category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryService.getEntityById(request.getCategoryId());
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        ProductResponse response = productMapper.toResponse(saved);
        response.setVariants(List.of());
        response.setSpecifications(List.of());
        return response;
    }

    public ProductResponse update(Integer id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        String oldPublicId = product.getThumbnailPublicId();
        String newPublicId = request.getThumbnailPublicId();

        if (oldPublicId != null && !oldPublicId.isEmpty() && (newPublicId == null || !oldPublicId.equals(newPublicId))) {
            imageStorageService.delete(oldPublicId);
        }

        productMapper.updateEntityFromRequest(request, product);

        // Update brand if provided
        if (request.getBrandId() != null) {
            Brand brand = brandService.getEntityById(request.getBrandId());
            product.setBrand(brand);
        }

        // Update category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryService.getEntityById(request.getCategoryId());
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        return enrichProducts(List.of(saved)).get(0);
    }

}
