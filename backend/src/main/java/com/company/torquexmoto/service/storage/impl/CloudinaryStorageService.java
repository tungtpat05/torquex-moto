package com.company.torquexmoto.service.storage.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.company.torquexmoto.dto.common.ImageUploadResult;
import com.company.torquexmoto.exception.StorageException;
import com.company.torquexmoto.service.storage.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryStorageService implements ImageStorageService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:torquex-moto}")
    private String cloudinaryFolder = "torquex-moto";

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024L; // 5 MB

    @Override
    public ImageUploadResult upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("File is empty or null");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds the maximum allowed limit of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file format. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed.");
        }

        try {
            Map<?, ?> options = (cloudinaryFolder != null && !cloudinaryFolder.isBlank())
                    ? ObjectUtils.asMap("folder", cloudinaryFolder.trim())
                    : ObjectUtils.emptyMap();
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            return new ImageUploadResult(url, publicId);
        } catch (IOException e) {
            throw new StorageException("Failed to upload file to Cloudinary", e);
        }
    }

    @Override
    public void delete(String publicId) {
        if (publicId == null || publicId.isEmpty()) {
            return;
        }
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new StorageException("Failed to delete file from Cloudinary: " + publicId, e);
        }
    }
}
