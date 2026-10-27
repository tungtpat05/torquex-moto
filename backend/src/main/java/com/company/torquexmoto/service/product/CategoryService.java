package com.company.torquexmoto.service.product;

import com.company.torquexmoto.dto.product.request.CategoryCreateRequest;
import com.company.torquexmoto.dto.product.request.CategoryUpdateRequest;
import com.company.torquexmoto.dto.product.response.CategoryResponse;
import com.company.torquexmoto.entity.product.Category;
import com.company.torquexmoto.exception.DuplicateResourceException;
import com.company.torquexmoto.exception.ResourceNotFoundException;
import com.company.torquexmoto.mapper.product.CategoryMapper;
import com.company.torquexmoto.repository.product.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(categoryMapper::toResponse).toList();
    }

    public CategoryResponse getById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse create(CategoryCreateRequest request) {
        if(categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new DuplicateResourceException("Category", "name", request.getCategoryName());
        }
        Category category = categoryMapper.toEntity(request);
        categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse update(Integer id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        categoryMapper.updateEntityFromRequest(request, category);

        categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    public Category getEntityById(Integer id) {
        return categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }
}
