package com.company.torquexmoto.service.storage;

import com.company.torquexmoto.dto.common.ImageUploadResult;
import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    ImageUploadResult upload(MultipartFile file);
    void delete(String publicId);
}
