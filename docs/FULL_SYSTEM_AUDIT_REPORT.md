# BÁO CÁO KIỂM TOÁN TOÀN DIỆN HỆ THỐNG TORQUEX MOTO
**Full-Stack Architectural, Functional, Security, UI/UX & Reliability Audit**
*Thực hiện bởi: Senior Software Architect, Full-stack Engineer, QA Engineer & UI/UX Auditor*
*Thời gian kiểm toán: 06/11/2026*
*Chế độ: AUDIT ONLY (Read-Only Verification)*

---

## 1. EXECUTIVE SUMMARY (TỔNG QUAN ĐIỀU HÀNH)

### 1.1. Hiện trạng tổng thể của dự án
Dự án **TorqueX Moto** được định vị là sàn thương mại điện tử chuyên biệt cho mô tô phân khối lớn và phụ kiện cao cấp, kiến trúc phân tách độc lập **Spring Boot 3.2.3 REST API (Java 21)** và **React 19 TypeScript Single Page Application (Vite 7, Material UI v7)**.

Qua kiểm tra chuyên sâu mã nguồn và lịch sử phát triển (`build.log`, mã nguồn backend/frontend), hệ thống ban đầu được khởi tạo/tái cấu trúc từ một đồ án/mẫu thương mại điện tử cũ (*ElectricFanShop / MotoVault*). Dự án đang ở trạng thái **bị bỏ dở giữa chừng (Mid-abandoned State)** với sự chênh lệch rất lớn giữa các tầng kiến trúc:
- **Phần danh mục sản phẩm (Product Catalog & Specifications)**: Đã được tái cấu trúc tương đối bài bản (Flyway V4 structured spec definitions, variants, images, brand, category).
- **Phần nghiệp vụ giao dịch lõi (Order, Checkout, Payment, Coupon, Shipment, Review)**: **Hoàn toàn chưa được phát triển ở Backend** hoặc chỉ là các class rỗng (`OrderController.java`, `UserController.java` chỉ có annotation rỗng).
- **Phần giao diện người dùng (Frontend UI)**: Có tính thẩm mỹ cao (Dark theme, neon/orange accents), tuy nhiên **hơn 40% các nút bấm, bộ lọc, form nhập liệu và màn hình quản trị (Dashboard) là Mock Data hoặc UI tĩnh không có logic xử lý (Dead UI)**.

### 1.2. Mức độ hoàn thiện ước tính
| Phân hệ / Tầng | Mức độ hoàn thiện thực tế | Đánh giá trạng thái |
|---|---|---|
| **Authentication & Authorization** | **70%** | Đã có JWT + Google OAuth2, nhưng thiếu Refresh Token, thiếu Logout backend, gửi token qua query URL. |
| **Product & Catalog Management** | **75%** | CRUD hoạt động tốt, có cấu trúc Spec động (V4), nhưng thiếu API phân trang, thiếu bộ lọc tổng hợp, thiếu chức năng xóa (Delete). |
| **Cart System** | **80%** | Đã tích hợp API đầy đủ (thêm, tăng, giảm, xóa item trong giỏ), tính toán giá chuẩn xác. |
| **Order & Checkout System** | **0%** | Backend trống rỗng (`OrderController` rỗng, không có `OrderService`), Frontend chưa có trang Checkout/Order History. |
| **Promotion / Coupon** | **10%** | Chỉ có bảng DB và Entity, không có Repository, Service, API hay logic áp mã. |
| **Review & Rating** | **15%** | Entity và DTO có sẵn nhưng lỗi cấu trúc DB, UI frontend 100% hardcoded mock data. |
| **User & Profile Management** | **25%** | Đăng ký/đăng nhập hoạt động; `UserController` rỗng; không có quản lý địa chỉ, đổi mật khẩu hay quản lý user admin. |
| **Admin Dashboard** | **10%** | Toàn bộ số liệu, biểu đồ doanh thu (SVG hardcoded), bảng đơn hàng gần đây là dữ liệu giả (Hardcoded). |
| **Testing & CI/CD** | **0%** | Zero automated tests (Không có unit test, integration test ở cả Backend và Frontend). |
| **TỔNG THỂ HỆ THỐNG** | **~35% - 40%** | **CHƯA ĐỦ ĐIỀU KIỆN PRODUCTION** |

### 1.3. Các vấn đề nghiêm trọng nhất (Top Critical Risks)
1. **Lệch cấu trúc JPA Entity và Database Schema (`Review.java` vs `V1__init_schema.sql`)**: Entity `Review` tham chiếu cột `product_id` (`nullable = false`), nhưng migrations Flyway chưa từng tạo cột này. Bất kỳ truy vấn nào chạm tới Review sẽ gây sập (Crash SQL Server Exception).
2. **Lỗ hổng bảo mật rò rỉ JWT qua URL (`OAuth2SuccessHandler.java`)**: Token JWT sau khi đăng nhập Google OAuth2 được nối trực tiếp vào URL query string (`?token=...`), dẫn đến nguy cơ lộ token qua Browser History, Server Access Logs và HTTP Referer headers.
3. **Mất an toàn dữ liệu do bỏ sót `@Valid` ở Controllers (`ProductController`, `BrandController`, `ColorController`)**: DTO đã cấu hình validation kỹ lưỡng nhưng các controller không kích hoạt annotation `@Valid`. Dữ liệu rác, chuỗi rỗng và giá trị âm có thể lọt thẳng vào DB.
4. **Không cấu hình CORS ở Backend**: Backend hoàn toàn không có cấu hình CORS (`http.cors()` vắng mặt trong `SecurityConfig.java`). Khi frontend deploy độc lập trên domain hoặc port khác dev-proxy, toàn bộ API sẽ bị trình duyệt chặn.
5. **N+1 Query & Không có Database Index**: Toàn bộ quan hệ `@ManyToOne` không dùng JOIN FETCH/EntityGraph; bảng DB thiếu toàn bộ non-clustered indexes trên Foreign Keys, gây Full Table Scan diện rộng khi dữ liệu tăng.

### 1.4. Kết luận sơ bộ
> **CẢNH BÁO QUAN TRỌNG:** Dự án **tuyệt đối KHÔNG ĐƯỢC PHÉP tiếp tục đắp thêm tính năng mới** khi chưa xử lý các lỗ hổng nền tảng. Cần thực hiện củng cố hạ tầng (Foundation Hardening & Core Business Logic) theo đúng lộ trình Roadmap trước khi chuyển sang giai đoạn phát triển mở rộng.

---

## 2. PROJECT HEALTH ASSESSMENT (ĐÁNH GIÁ CHỈ SỐ SỨC KHỎE DỰ ÁN)

Thang điểm: 1 - 10 (1: Cực kỳ yếu kém / Nguy hiểm - 10: Hoàn hảo, chuẩn Production).

```
[Architecture]          :  6 / 10  (Tách biệt REST + SPA tốt, nhưng thiếu tầng trung gian, DTO rò rỉ Entity)
[Business Logic]        :  3 / 10  (Mới chỉ có Catalog + Cart; thiếu 100% Order, Checkout, Coupon, Shipment)
[Backend Implementation]:  5 / 10  (Controller/Service chia rõ, nhưng nhiều file rỗng, thiếu validation @Valid)
[Frontend Execution]    :  5 / 10  (Giao diện hiện đại, MUI v7 đồng bộ, nhưng ~40% nút bấm & bộ lọc là Dead UI)
[Database & Migration]  :  5 / 10  (Flyway migration tốt, nhưng thiếu index, sai lệch cột entity Review)
[Security & Auth]       :  4 / 10  (Có Spring Security + JWT, nhưng thiếu CORS, lộ token URL, không bắt JwtException)
[UI/UX Design]          :  6 / 10  (Visual styling đẹp, dark mode ấn tượng, nhưng dính tên thương hiệu rác MotoVault)
[Performance]           :  4 / 10  (N+1 query ở Catalog, thiếu phân trang server-side, bundle JS 941KB không code-split)
[Automated Testing]     :  0 / 10  (Zero test cases trên toàn bộ dự án, không có file test nào)
[Deployment Readiness]  :  2 / 10  (Thiếu file .env.example, thiếu CORS, baseUrl frontend hardcode, Swagger bị chặn 401)
---------------------------------------------------------------------------------------------------------
ĐIỂM TRUNG BÌNH HỆ THỐNG: 4.0 / 10 (Mức cảnh báo Cần Đại tu Nền tảng)
```

---

## 3. DETAILED ISSUE REGISTRY (BẢNG TRUY VẾT LỖI CHI TIẾT)

| ID | Module / File | Issue Description | Category | Severity | Evidence (Mã nguồn / Luồng thực tế) | Suggested Fix |
|---|---|---|---|---|---|---|
| **ISS-01** | `backend/.../Review.java` & `V1__init_schema.sql` | Entity `Review` định nghĩa quan hệ `@ManyToOne` với `Product` qua cột `product_id` (`nullable = false`), nhưng trong bảng `review` ở `V1__init_schema.sql` hoàn toàn KHÔNG có cột `product_id`. | Database / ORM | **CRITICAL** | `Review.java` (L30-32): `@JoinColumn(name = "product_id", nullable = false) private Product product;`. Trong khi `V1__init_schema.sql` (L181-190) chỉ có `order_item_id`, `user_id`, `rating`, `comment`. | Tạo Flyway migration `V5__add_product_id_to_review.sql` để `ALTER TABLE review ADD product_id INT NOT NULL REFERENCES product(id)`. |
| **ISS-02** | `backend/.../OAuth2SuccessHandler.java` | JWT token được đính kèm trực tiếp vào tham số query string của redirect URL sau khi đăng nhập Google OAuth2 thành công. | Security | **CRITICAL** | `OAuth2SuccessHandler.java` (L35): `String targetUrl = successRedirectUrl + "/auth/success?token=" + URLEncoder.encode(jwtToken, ...);`. Token bị lưu trong history trình duyệt, web server logs và Referer headers. | Thay bằng truyền qua HttpOnly Secure Cookie hoặc sinh mã Authorization Code tạm thời (short-lived one-time code 30s) để frontend đổi lấy JWT qua POST request. |
| **ISS-03** | `backend/.../SecurityConfig.java` | Hoàn toàn không cấu hình CORS. Không có `http.cors()` hay `CorsConfigurationSource` bean. | Security / Infra | **CRITICAL** | `SecurityConfig.java` (L30-53) chỉ có `csrf.disable()`, `sessionManagement` mà không gọi `cors()`. Frontend gọi API ngoài môi trường Vite proxy sẽ bị CORS error. | Thêm `http.cors(cors -> cors.configurationSource(corsConfigurationSource()))` và khai báo Bean cấu hình origin, headers, methods được phép. |
| **ISS-04** | `backend/.../ProductController.java` | Thiếu annotation `@Valid` ở tất cả các endpoint `@PostMapping` và `@PutMapping` (`create`, `update`, `createVariant`, `updateVariant`, `createImage`, `createSpecification`). | Data Integrity | **HIGH** | `ProductController.java` (L45, L52, L72, L83, L121, L131, L154, L165). Dù DTO có `@NotBlank`, `@Size`, `@DecimalMin`, nhưng Spring không kích hoạt validation. | Thêm `@Valid` trước các tham số `@RequestBody` ở toàn bộ controller methods. |
| **ISS-05** | `backend/.../BrandController.java` & `ColorController.java` | Thiếu `@Valid` ở các endpoint `create` và `update`. | Data Integrity | **HIGH** | `BrandController.java` (L39, L46), `ColorController.java` (L35, L42): `@RequestBody BrandCreateRequest request` không có `@Valid`. | Bổ sung `@Valid` vào tất cả các method nhận request body. |
| **ISS-06** | `backend/.../SecurityConfig.java` | Swagger UI và OpenAPI docs bị chặn bởi Spring Security (yêu cầu authenticated). | Documentation | **MEDIUM** | `SecurityConfig.java` (L34-43) không có permit cho `/swagger-ui/**`, `/v3/api-docs/**`. Truy cập `http://localhost:8081/swagger-ui/index.html` nhận HTTP 401 Unauthorized. | Thêm `.requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()` vào `SecurityConfig`. |
| **ISS-07** | `backend/.../JwtAuthenticationFilter.java` | Bộ lọc JWT không bọc `try-catch` khi giải mã token (`extractUsername`). Token hết hạn hoặc sai định dạng gây unhandled exception 500 thay vì 401. | Security / Error | **HIGH** | `JwtAuthenticationFilter.java` (L40-41): `jwtToken = authHeader.substring(7); userEmail = jwtService.extractUsername(jwtToken);`. Ném `ExpiredJwtException` ra ngoài FilterChain khiến Tomcat/Spring trả về HTTP 500. | Bọc try-catch quanh việc xử lý token; nếu token lỗi/hết hạn thì xóa context và cho phép filter chain tiếp tục hoặc ghi trực tiếp mã lỗi 401 vào response. |
| **ISS-08** | `backend/.../GlobalExceptionHandler.java` | Phơi bày chi tiết lỗi cơ sở dữ liệu nội bộ qua `DataIntegrityViolationException`. | Security | **MEDIUM** | `GlobalExceptionHandler.java` (L68-77): trả về `ex.getMessage()` trong HTTP Conflict body. Thông tin tên bảng, tên khóa ngoại, cấu trúc SQL bị lộ cho client. | Trả về thông báo lỗi thân thiện chuẩn hóa, chỉ log `ex.getMessage()` ở tầng nội bộ server. |
| **ISS-09** | `backend/.../GlobalExceptionHandler.java` | Không xử lý `AccessDeniedException` (Spring Security). Người dùng bị từ chối quyền sẽ nhận lỗi 500 thay vì 403. | Error Handling | **HIGH** | `GlobalExceptionHandler.java` (L112-121): Bắt `Exception.class` và trả về 500. `AccessDeniedException` bị gom vào đây, biến lỗi 403 Forbidden thành lỗi máy chủ 500. | Thêm `@ExceptionHandler(AccessDeniedException.class)` trả về `HttpStatus.FORBIDDEN` (403). |
| **ISS-10** | `backend/.../CloudinaryStorageService.java` | API upload ảnh không kiểm tra định dạng file (MIME type), phần mở rộng hoặc dung lượng tối đa. | Security | **HIGH** | `CloudinaryStorageService.java` (L22-34): Chỉ kiểm tra `file.isEmpty()`, sau đó gửi thẳng byte stream lên Cloudinary. Có thể upload file HTML (Stored XSS) hoặc file nhị phân độc hại. | Thêm danh sách whitelist MIME types (`image/jpeg`, `image/png`, `image/webp`), giới hạn dung lượng (vd: 5MB), cấu hình `spring.servlet.multipart.max-file-size`. |
| **ISS-11** | `backend/.../OrderController.java` | Class Controller rỗng hoàn toàn, không có endpoint nào. Toàn bộ phân hệ Order bị tê liệt. | Business Logic | **CRITICAL** | `OrderController.java` (L1-15): `@Controller public class OrderController {}`. Không có `@RestController`, không có `@RequestMapping`, không có bất kỳ method nào. | Xây dựng đầy đủ `OrderService`, `OrderController`, DTOs (CreateOrder, OrderResponse, OrderStatusUpdate). |
| **ISS-12** | `backend/.../UserController.java` | Class Controller rỗng hoàn toàn. Không có endpoint quản lý người dùng hay địa chỉ. | Business Logic | **HIGH** | `UserController.java` (L1-8): `@Controller public class UserController {}`. Không có method xử lý profile, address hay danh sách user admin. | Xây dựng REST API cho `UserController` (`/api/v1/users/profile`, `/api/v1/users/addresses`, `/api/v1/admin/users`). |
| **ISS-13** | `backend/.../AuthenticationController.java` vs `authService.ts` | Frontend gọi `POST /api/v1/auth/logout`, nhưng Backend hoàn toàn không có endpoint `/logout`. | Functional Gap | **MEDIUM** | `frontend/src/services/authService.ts` (L48-55) gọi `/auth/logout`, nhưng `AuthenticationController.java` chỉ có `/register`, `/login`, `/me`. | Thêm endpoint `POST /api/v1/auth/logout` ở backend (có thể dùng để hủy token/refresh token nếu triển khai blacklist). |
| **ISS-14** | `backend/.../ProductService.java` | N+1 Query nghiêm trọng khi lấy danh sách sản phẩm. | Performance | **HIGH** | `ProductService.java` (L29-30): `productRepository.findAll()` kết hợp với `@ManyToOne` EAGER trong `Product.java` tạo ra 1 + 2N câu truy vấn SQL độc lập cho Brand và Category. | Sử dụng `@EntityGraph(attributePaths = {"brand", "category"})` hoặc `JOIN FETCH` trong Spring Data JPA repository. |
| **ISS-15** | `backend/src/main/resources/db/migration/` | Toàn bộ cơ sở dữ liệu không có bất kỳ một secondary index nào trên các cột khóa ngoại. | Performance / DB | **HIGH** | Không có câu lệnh `CREATE INDEX` trong V1, V2, V3, V4. Các trường `brand_id`, `category_id`, `user_id`, `order_id`, `variant_id` đều bị Full Table Scan khi JOIN. | Tạo migration bổ sung non-clustered indexes cho tất cả Foreign Keys và các trường tìm kiếm/lọc thường xuyên (`slug`, `order_status`). |
| **ISS-16** | `backend/.../ProductController.java` & `ProductService.java` | API `GET /api/v1/products` không hỗ trợ phân trang (Pagination), tìm kiếm (Search), lọc khoảng giá hay lọc theo hãng (Brand). | Performance / API | **HIGH** | `ProductController.java` (L30): chỉ nhận `Integer categoryId`. Trả về toàn bộ danh sách `List<ProductResponse>`. Khi có hàng ngàn xe sẽ gây tràn bộ nhớ JVM và nghẽn băng thông. | Refactor sang sử dụng Spring Data `Pageable` (`page`, `size`, `sort`) kết hợp `JpaSpecificationExecutor` cho multi-criteria search. |
| **ISS-17** | `frontend/.../CartSummary.tsx` | Nút "Proceed to Checkout" không có sự kiện click, không điều hướng, không kích hoạt logic thanh toán. | Functional / UI | **HIGH** | `CartSummary.tsx` (L145-163): Nút `Proceed to Checkout` không có thuộc tính `onClick` hay `to`. Người dùng không thể tiến hành mua hàng. | Tạo trang Checkout (`/checkout`), gắn handler điều hướng và kết nối luồng tạo đơn hàng. |
| **ISS-18** | `frontend/.../FilterSidebar.tsx` | Toàn bộ thanh lọc (Brand, Category, Price, Features) trên trang `/products` chỉ là giao diện tĩnh, không tác động đến danh sách xe. | Functional / UI | **HIGH** | `FilterSidebar.tsx` (L101-107): Các `Checkbox` không có `checked` state, không có `onChange`, category pill không có `onClick`, nút "Reset All" không có handler. | Quản lý state bộ lọc (hoặc sync qua URL query params), truyền callback hoặc kết nối với hook `useProducts` để fetch dữ liệu đã lọc. |
| **ISS-19** | `frontend/.../HeroSection.tsx` | Thanh tìm kiếm trên trang sản phẩm `/products` không có state và không kích hoạt tìm kiếm. | Functional / UI | **MEDIUM** | `HeroSection.tsx` (L115-142): `InputBase` không có `value`/`onChange`, nút `Search` không có `onClick`. | Kết nối giá trị tìm kiếm với danh sách sản phẩm hoặc query parameter `?search=...`. |
| **ISS-20** | `frontend/.../Navbar.tsx` | Menu điều hướng chứa các liên kết dẫn đến trang lỗi 404 (`/support`, `/order`). | UI / UX | **MEDIUM** | `Navbar.tsx` (L22, L38): khai báo đường dẫn `/support` và `/order`. Tuy nhiên `AppRoutes.tsx` không có route này, dẫn đến trang `NotFoundPage`. | Bổ sung các trang tương ứng hoặc tạm thời ẩn các menu item chưa phát triển. |
| **ISS-21** | `frontend/.../HomePage.tsx` & components | Tên thương hiệu bị lẫn lộn nghiêm trọng ("MotoVault" thay vì "TorqueX Moto"). | Brand / UI | **LOW** | `HomeCommunity.tsx` (L37, L68), `HomePromise.tsx` (L78), `HomeReviews.tsx` (L14, L21), `HomePage.tsx` (L30) xuất hiện chuỗi "MotoVault". | Thay thế toàn bộ từ khóa "MotoVault" thành "TorqueX Moto" để đảm bảo tính nhất quán của thương hiệu. |
| **ISS-22** | `frontend/.../ProductInfo.tsx` | Các nút chức năng phụ "Wishlist", "Share", "Compare" không có action handler. | UI / UX | **LOW** | `ProductInfo.tsx` (L396-453): Ba nút bấm giao diện không có `onClick`, hoàn toàn không phản hồi khi người dùng tương tác. | Gắn handler tương tác (vd: copy link chia sẻ cho "Share", thông báo tính năng đang phát triển cho "Wishlist"/"Compare"). |
| **ISS-23** | `frontend/.../AdminDashboardPage.tsx` | Toàn bộ Dashboard Quản trị là dữ liệu tĩnh giả lập (Mock Data), biểu đồ là vector SVG cố định. | Functional Gap | **MEDIUM** | `AdminDashboardPage.tsx`, `RevenueChart.tsx`, `OrdersChart.tsx`, `RecentOrdersTable.tsx`, `TopProductsList.tsx` chứa dữ liệu hardcoded 100%. | Xây dựng API thống kê ở backend (`/api/v1/admin/dashboard/stats`, `/orders/recent`) và tích hợp thư viện biểu đồ thực tế (Recharts/Chart.js). |
| **ISS-24** | `frontend/.../useProductDetail.ts` & `RelatedProducts.tsx` | Overfetching dữ liệu nghiêm trọng khi xem chi tiết 1 xe. | Performance | **HIGH** | `useProductDetail.ts` gọi 4 API đồng thời; `RelatedProducts.tsx` (L21) gọi thêm `getProducts()` (tải toàn bộ DB) chỉ để cắt lấy 4 xe liên quan. | Bổ sung API `GET /api/v1/products/{id}/related` giới hạn 4 bản ghi; gom dữ liệu images/variants/specs vào DTO chi tiết sản phẩm. |
| **ISS-25** | `frontend/.../axiosClient.ts` | Base URL API bị hardcode tương đối (`/api/v1`), không đọc biến môi trường `import.meta.env.VITE_API_BASE_URL`. | Config / Deploy | **MEDIUM** | `axiosClient.ts` (L4): `baseURL: "/api/v1"`. Khi triển khai frontend lên hosting riêng (Vercel, S3), request sẽ không trỏ được về server backend. | Đổi thành `baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1"`. |
| **ISS-26** | `backend/` & `frontend/` | Thiếu file mẫu biến môi trường `.env.example`. | DevOps / Config | **LOW** | File `.env` chứa mật khẩu/secrets được gitignore nhưng không có file `.env.example` làm mẫu cho lập trình viên mới. | Tạo `backend/.env.example` và `frontend/.env.example` với các placeholder rõ ràng. |
| **ISS-27** | `backend/.../ProductForm.tsx` | Tạo/Cập nhật thông số kỹ thuật (Specifications) gửi N request tuần tự từ trình duyệt. | Performance | **MEDIUM** | `ProductForm.tsx` (L234-263): Chạy vòng lặp `for...of` gọi API `createProductSpecification` hoặc `updateProductSpecification` từng thuộc tính một. | Tạo endpoint Backend hỗ trợ lưu hàng loạt `POST /api/v1/products/{id}/specifications/batch` trong 1 transaction duy nhất. |
| **ISS-28** | `frontend/vite.config.ts` | Bundle JavaScript đơn khối (Monolithic bundle > 941 KB), không có code-splitting / dynamic imports. | Performance | **MEDIUM** | Log build: `index-BN4qosDs.js` nặng 941.66 kB, ảnh banner `community-banner.jpg` nặng xấp xỉ 1 MB (995 kB). | Sử dụng `React.lazy()` cho các trang Admin và route ít dùng; tối ưu hóa ảnh thành định dạng WebP nén. |
| **ISS-29** | `backend/.../ReviewResponse.java` | DTO phản hồi nhúng trực tiếp Entity Hibernate (`OrderItem`, `Product`, `User`), nguy cơ đệ quy vô tận và lộ password hash. | Architecture / Sec | **HIGH** | `ReviewResponse.java` (L19-21): Trường kiểu `OrderItem`, `Product`, `User`. Khi Jackson parse thành JSON sẽ gặp Circular Reference hoặc rò rỉ `passwordHash` của User. | Thay thế bằng các DTO thu gọn (vd: `UserSummaryResponse`, `ProductSummaryResponse`). |
| **ISS-30** | Toàn bộ dự án | Hoàn toàn không có kiểm thử tự động (Zero Automated Tests). | Reliability / QA | **HIGH** | Thư mục `backend/src/test` không tồn tại; frontend không cài đặt bất kỳ test runner nào (Vitest, Jest). Không thể đảm bảo tính hồi quy khi refactor. | Cấu hình JUnit 5 + Mockito cho backend; cấu hình Vitest + React Testing Library cho frontend. |

---

## 4. MISSING FEATURES & INCOMPLETE MODULES (CHỨC NĂNG CÒN THIẾU & CHƯA HOÀN THIỆN)

Phân loại theo tiêu chuẩn kiểm định:

### A. Missing Features (Chức năng cần thiết nhưng chưa được phát triển)
1. **Module Đặt hàng & Thanh toán (Checkout & Order Placement)**:
   - Form nhập địa chỉ giao nhận hàng, tính phí vận chuyển động.
   - Lựa chọn phương thức thanh toán: COD (Tiền mặt khi nhận xe), Chuyển khoản ngân hàng, Cổng thanh toán (VNPay / MoMo / Stripe).
   - API đặt hàng từ giỏ hàng, trừ tồn kho trong Database transaction.
2. **Module Lịch sử đơn hàng khách hàng (Order History & Tracking)**:
   - Màn hình `/orders` cho khách hàng theo dõi danh sách xe đã đặt.
   - Màn hình chi tiết đơn hàng `/orders/:id` hiển thị trạng thái vận chuyển (Pending, Confirmed, Shipping, Delivered, Cancelled).
   - Chức năng hủy đơn hàng khi trạng thái còn đang xử lý (`PENDING`).
3. **Module Quản trị Đơn hàng (Admin Order Management)**:
   - Danh sách đơn hàng trong Admin Portal (`/admin/orders`).
   - Bộ lọc theo trạng thái đơn hàng và ngày tạo.
   - Cập nhật trạng thái đơn hàng (Duyệt đơn, Đang giao, Đã giao, Hủy đơn).
4. **Module Đánh giá sản phẩm (Product Reviews & Ratings)**:
   - API cho phép khách hàng đã mua xe gửi đánh giá (Rating 1-5 sao kèm nhận xét).
   - API lấy danh sách đánh giá theo từng sản phẩm cụ thể.
   - Thống kê điểm đánh giá trung bình thực tế cho sản phẩm.
5. **Module Quản lý Khuyến mãi (Coupon / Voucher Management)**:
   - API xác thực mã giảm giá khi đặt hàng (kiểm tra hạn dùng, giá trị đơn hàng tối thiểu).
   - Admin CRUD quản lý danh sách mã giảm giá (`/admin/coupons`).
6. **Module Quản lý Người dùng & Phân quyền (User Administration)**:
   - Admin xem danh sách tài khoản, khóa/mở khóa tài khoản, phân quyền (STAFF, ADMIN, CUSTOMER).
   - Khách hàng quản lý sổ địa chỉ giao hàng (Thêm, sửa, xóa, đặt mặc định).
   - Chức năng đổi mật khẩu và cập nhật thông tin cá nhân.
7. **Module Xóa sản phẩm / Biến thể / Danh mục / Thương hiệu (Soft Delete)**:
   - Hiện tại Backend không có API DELETE cho Product, Variant, Brand, Category. Cần bổ sung cơ chế Soft Delete (`isActive = false`).

### B. Incomplete Modules (Chức năng mới triển khai một phần / Dead UI)
1. **Catalog Filters (Frontend)**: Đã có thanh lọc UI rất đẹp mắt nhưng không có state binding, không truyền tham số lên API, không lọc được dữ liệu.
2. **Catalog Search (Frontend)**: Thanh tìm kiếm trên Hero banner chưa có event handler.
3. **Admin Dashboard (Frontend)**: Giao diện đầy đủ nhưng 100% số liệu là hardcoded mock data.
4. **Product Detail Specification System**: Đã có Flyway V4 và API CRUD, nhưng frontend gọi tuần tự N requests để lưu thay vì 1 batch request.
5. **Customer Reviews Section**: Component hiển thị đánh giá cố định của người dùng ảo cho mẫu xe CB650R, hiển thị trên tất cả các trang xe khác nhau.

---

## 5. UI/UX FINDINGS & HEURISTIC EVALUATION

### 5.1. Visual Design & Brand Consistency
- **Sự cố lẫn lộn Brand Name**: Landing page xuất hiện nhiều lần tên "MotoVault" thay vì "TorqueX Moto" (`HomeCommunity.tsx`, `HomePromise.tsx`, `HomeReviews.tsx`). Điều này gây nhầm lẫn nghiêm trọng về danh tính thương hiệu và tạo cảm giác dự án đi sao chép cẩu thả.
- **Tông màu & Hierarchy**: Điểm cộng lớn là hệ màu Dark Theme (`#09090b`, `#121214`, `#18181b`) kết hợp điểm nhấn cam mô tô thể thao (`#e28a3a`, `#ff6b35`) rất hợp với phong cách phân khối lớn, độ tương phản text đạt chuẩn WCAG AA.
- **Kích thước Asset ảnh**: File ảnh banner `community-banner.jpg` có dung lượng lên đến 995.71 kB, gây giật lag khi tải trên mạng di động. Cần nén sang WebP (~80-120 kB).

### 5.2. User Experience & Flow Deadlocks
- **Luồng giỏ hàng cụt (Cart Deadlock)**: Khách hàng thêm xe vào giỏ thành công, mở trang giỏ hàng thấy tổng tiền, nhưng nút `Proceed to Checkout` không bấm được. Luồng mua hàng dừng lại tại đây mà không có hướng đi tiếp.
- **Điều hướng 404 từ Navbar chính**: Khách hàng bấm vào menu `Support` hoặc `Order` trên thanh điều hướng đầu trang sẽ gặp ngay màn hình 404 Not Found.
- **Nút tương tác không phản hồi (Unresponsive Controls)**:
  - Nút "Apply" mã giảm giá trong Giỏ hàng không phản ứng.
  - Các nút Wishlist, Share, Compare ở trang chi tiết sản phẩm không có phản hồi toast hay dialog.
  - Nút "Watch the Story" ở Hero trang chủ không hoạt động.
  - Form đăng ký nhận tin (Newsletter) ở chân trang không lưu thông tin người dùng.
- **Empty State thiếu tối ưu**: Khi giỏ hàng trống, trang vẫn cố gắng hiển thị khối sản phẩm gợi ý và tải toàn bộ danh mục sản phẩm từ server với productId mặc định là 1.

---

## 6. RECOMMENDED DEVELOPMENT ROADMAP (LỘ TRÌNH KHẮC PHỤC & PHÁT TRIỂN)

Lộ trình được chia làm 6 giai đoạn rõ ràng theo thứ tự ưu tiên giảm dần:

```
[Phase A: Critical Bugs & Security] ──► [Phase B: Core Business & Data Integrity] ──► [Phase C: Incomplete Features]
                                                                                               │
[Phase F: Testing & Production Ready] ◄── [Phase E: Performance & Code Quality] ◄── [Phase D: UI/UX Improvements]
```

### Phase A: Critical Bugs, Security & Database Fixes (Ưu tiên: KHẨN CẤP) - ✅ [COMPLETED / ĐÃ HOÀN THÀNH]
- **Trạng thái**: **HOÀN THÀNH (100%)** - Đã kiểm thử tự động và xác thực thực tế trên browser.
- **Mục tiêu**: Loại bỏ nguy cơ crash DB, vá lỗ hổng bảo mật rò rỉ token qua cookie an toàn HttpOnly, cấu hình CORS và mở cổng kết nối API/Swagger.
- **Các file đã thực hiện**:
  - `backend/src/main/resources/db/migration/V5__fix_review_and_indexes.sql` *(Tạo mới)*
  - `backend/src/main/java/com/company/torquexmoto/config/SecurityConfig.java`
  - `backend/src/main/java/com/company/torquexmoto/security/jwt/JwtAuthenticationFilter.java`
  - `backend/src/main/java/com/company/torquexmoto/security/oauth2/OAuth2SuccessHandler.java`
  - `backend/src/main/java/com/company/torquexmoto/controller/auth/AuthenticationController.java`
  - `backend/src/main/java/com/company/torquexmoto/exception/GlobalExceptionHandler.java`
  - `backend/src/main/java/com/company/torquexmoto/service/storage/impl/CloudinaryStorageService.java`
  - `backend/src/main/java/com/company/torquexmoto/controller/product/ProductController.java`
  - `backend/src/main/java/com/company/torquexmoto/controller/product/BrandController.java`
  - `backend/src/main/java/com/company/torquexmoto/controller/product/ColorController.java`
  - `frontend/src/lib/axiosClient.ts`
  - `frontend/src/context/AuthProvider.tsx`
  - `frontend/src/pages/auth/AuthSuccessPage.tsx`
  - `frontend/src/pages/auth/SignInPage.tsx`
  - `frontend/vite.config.ts`
  - `backend/.env.example` *(Tạo mới)*
  - `frontend/.env.example` *(Tạo mới)*
- **Kết quả nghiệm thu**:
  1. [x] **Database Migration V5**: Bổ sung cột `product_id` (FK đến `product`) cho bảng `review`, thiết lập non-clustered indexes cho tất cả Foreign Key (`brand_id`, `category_id`, `user_id`, `order_id`, `variant_id`, `cart_id`, `spec_definition_id`, v.v.). Flyway thực thi thành công trong 0.3s.
  2. [x] **CORS Configuration**: Cấu hình `CorsConfigurationSource` hỗ trợ `allowCredentials(true)` cho origins `http://localhost:3000`, `http://127.0.0.1:3000`, `http://localhost:5173`.
  3. [x] **Swagger UI**: Mở quyền truy cập `permitAll` cho `/swagger-ui/**`, `/v3/api-docs/**`. Kiểm chứng trả về HTTP 200 OK.
  4. [x] **HttpOnly Cookie Authentication**:
     - Khi `login` hoặc `register`, backend phát hành `Set-Cookie: authToken=...; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax`.
     - Thêm endpoint `POST /api/v1/auth/logout` xóa cookie (`Max-Age=0`).
     - `OAuth2SuccessHandler` chuyển sang cấp HttpOnly Cookie và chuyển hướng sạch về `/auth/success` (loại bỏ hoàn toàn rò rỉ token trên query param `?token=`).
     - `JwtAuthenticationFilter` hỗ trợ trích xuất token song song từ cả Header `Bearer` và Cookie `authToken`/`jwt_token`. Bọc try-catch tránh ném uncaught exception/500 khi token hỏng hoặc hết hạn.
  5. [x] **Data Validation**: Bổ sung `@Valid` cho tất cả Request Body tại `ProductController`, `BrandController`, `ColorController`, `AuthenticationController`.
  6. [x] **Upload Security**: Giới hạn file upload tối đa 5MB và whitelist định dạng ảnh (`jpeg`, `png`, `webp`, `gif`, `svg+xml`) trong `CloudinaryStorageService`.
  7. [x] **Exception Masking**: Bổ sung handler `AccessDeniedException` (HTTP 403) và che giấu cấu trúc SQL nội bộ trong `DataIntegrityViolationException`.
  8. [x] **Frontend Cookie Synchronization**:
     - `axiosClient` cấu hình `withCredentials: true`.
     - `AuthProvider` hỗ trợ fetch session qua cookie trực tiếp mà không phụ thuộc vào `localStorage`.
     - Proxy Vite forward thêm `/oauth2` và `/login/oauth2`.
     - Khởi chạy và kiểm thử thực tế trên browser thành công.

### Phase B: Core Business Logic & Data Integrity (Ưu tiên: CAO)
- **Mục tiêu**: Xây dựng phân hệ Đặt hàng & Người dùng hoàn chỉnh để khép kín luồng kinh doanh.
- **Các file bị ảnh hưởng**:
  - `backend/.../controller/order/OrderController.java`
  - `backend/.../service/order/OrderService.java` (Tạo mới)
  - `backend/.../dto/order/...` (Tạo mới)
  - `backend/.../controller/user/UserController.java`
  - `backend/.../service/user/UserService.java`
  - `backend/.../repository/user/UserAddressRepository.java` (Tạo mới)
  - `backend/.../service/auth/AuthenticationService.java` (Logout API)
- **Công việc**:
  1. Hiện thực hóa `OrderService` và `OrderController`: Đặt hàng từ giỏ, trừ tồn kho (Transactional), tính toán phí ship và tổng tiền, xem lịch sử đơn hàng, cập nhật trạng thái đơn hàng.
  2. Hiện thực hóa `UserController`: Cập nhật hồ sơ cá nhân, đổi mật khẩu, CRUD sổ địa chỉ giao hàng (`UserAddress`).
  3. Thêm API `POST /api/v1/auth/logout`.
  4. Bổ sung API Soft Delete cho Product, Variant, Brand, Category.

### Phase C: Incomplete Features & Missing Frontend Flows (Ưu tiên: CAO)
- **Mục tiêu**: Kết nối giao diện người dùng với các nghiệp vụ vừa xây dựng ở Phase B.
- **Các file bị ảnh hưởng**:
  - `frontend/src/pages/CheckoutPage.tsx` (Tạo mới)
  - `frontend/src/pages/OrdersPage.tsx` (Tạo mới)
  - `frontend/src/pages/admin/AdminOrdersPage.tsx` (Tạo mới)
  - `frontend/src/components/cart/CartSummary.tsx`
  - `frontend/src/components/product/FilterSidebar.tsx`
  - `frontend/src/components/product/HeroSection.tsx`
  - `frontend/src/routes/AppRoutes.tsx`
- **Công việc**:
  1. Tạo trang Checkout và liên kết nút `Proceed to Checkout` từ giỏ hàng sang trang thanh toán.
  2. Tạo trang lịch sử đơn hàng cho khách hàng (`/orders`) và trang quản lý đơn hàng cho Admin (`/admin/orders`).
  3. Kết nối bộ lọc (Hãng, Danh mục, Giá) và ô tìm kiếm trên trang `/products` vào logic fetch dữ liệu.
  4. Xây dựng API và giao diện quản lý đánh giá thực tế (Review system).

### Phase D: UI/UX Refinement & Brand Cleanup (Ưu tiên: TRUNG BÌNH)
- **Mục tiêu**: Chuẩn hóa trải nghiệm người dùng và hoàn thiện thương hiệu TorqueX Moto.
- **Các file bị ảnh hưởng**:
  - `frontend/src/components/home/HomeCommunity.tsx`, `HomePromise.tsx`, `HomeReviews.tsx`
  - `frontend/src/components/common/Navbar.tsx`
  - `frontend/src/components/common/Footer.tsx`
  - `frontend/src/components/product/ProductInfo.tsx`
- **Công việc**:
  1. Loại bỏ toàn bộ từ khóa "MotoVault", đồng bộ 100% thương hiệu "TorqueX Moto".
  2. Sửa menu Navbar: Trỏ đúng các route đã phát triển (`/orders`), loại bỏ hoặc thay thế các menu dẫn tới 404.
  3. Bổ sung toast thông báo phản hồi cho các nút Wishlist, Share, Newsletter.
  4. Tối ưu ảnh banner lớn sang WebP.

### Phase E: Performance Optimization & Code Quality (Ưu tiên: TRUNG BÌNH)
- **Mục tiêu**: Giảm thời gian phản hồi, tối ưu truy vấn cơ sở dữ liệu và dung lượng bundle.
- **Các file bị ảnh hưởng**:
  - `backend/.../ProductRepository.java` & `ProductService.java`
  - `backend/.../ProductController.java`
  - `frontend/vite.config.ts`
  - `frontend/src/routes/AppRoutes.tsx`
  - `frontend/src/components/product/RelatedProducts.tsx`
- **Công việc**:
  1. Triển khai phân trang Server-side (`Pageable`) cho danh sách sản phẩm.
  2. Dùng `@EntityGraph` loại bỏ triệt để N+1 query khi load sản phẩm kèm Brand/Category.
  3. Bổ sung API `GET /api/v1/products/{id}/related` để thay thế việc load toàn bộ DB từ frontend.
  4. Triển khai API batch specification `POST /api/v1/products/{id}/specifications/batch` để lưu thông số chỉ trong 1 request.
  5. Cấu hình Code-splitting với `React.lazy` và `manualChunks` trong Vite để chia nhỏ bundle 941 KB.

### Phase F: Automated Testing & Production Readiness (Ưu tiên: TRUNG BÌNH - CAO)
- **Mục tiêu**: Đảm bảo hệ thống đạt chuẩn vận hành ổn định và sẵn sàng bàn giao Production.
- **Các file bị ảnh hưởng**:
  - `backend/src/test/...`
  - `frontend/src/__tests__/...`
  - `backend/.env.example`, `frontend/.env.example`
  - `frontend/src/lib/axiosClient.ts`
- **Công việc**:
  1. Cấu hình biến môi trường `VITE_API_BASE_URL` trong `axiosClient.ts`.
  2. Tạo file `.env.example` cho cả 2 dự án.
  3. Viết Unit tests cho `CartService`, `OrderService`, `AuthenticationService`, `JwtService`.
  4. Viết Integration tests cho các REST API quan trọng.
  5. Thiết lập CI pipeline (GitHub Actions) chạy `mvn test` và `npm run build && npm run lint`.

---

## 7. FINAL RECOMMENDATION (KHUYẾN NGHỊ CUỐI CÙNG)

### 7.1. Những gì NÊN GIỮ NGUYÊN (Keep as-is)
- **Kiến trúc phân tầng Backend**: Phân chia `controller - service - repository - entity - dto - mapper` rất bài bản, đúng chuẩn công nghiệp.
- **Cơ chế Quản lý Thông số Kỹ thuật (Flyway V4 Structured Specs)**: Cấu trúc `spec_definition` gắn theo danh mục kết hợp `spec_definition_option` là một thiết kế rất linh hoạt cho sàn thương mại điện tử mô tô.
- **UI Design System Frontend**: Hệ thống màu sắc, typography (Outfit, Inter), card design và layout bằng Material UI v7 rất ấn tượng, có tính thẩm mỹ cao.
- **Cart Context & Service**: Logic tính toán giỏ hàng, cập nhật số lượng và kiểm tra tồn kho (Stock quantity) đã được viết rất cẩn thận.

### 7.2. Những gì CẦN REFACTOR (Refactor)
- **Product Listing & Search**: Chuyển từ tải toàn bộ danh sách sang phân trang Server-side kết hợp Specification Search.
- **JwtAuthenticationFilter**: Bổ sung bộ bắt lỗi ngoại lệ JWT và chuẩn hóa HTTP 401 response.
- **Product Specification Save Flow**: Chuyển từ N vòng lặp API tuần tự sang 1 Batch API duy nhất.
- **Frontend State Management của Bộ lọc (FilterSidebar)**: Đồng bộ hóa state bộ lọc lên URL search params để hỗ trợ bookmark và chia sẻ link.

### 7.3. Những gì CẦN VIẾT LẠI (Rewrite)
- **Cơ chế truyền token OAuth2**: Loại bỏ hoàn toàn việc truyền JWT qua URL query parameter trong `OAuth2SuccessHandler.java`.
- **Review System & DTO**: Viết lại `ReviewResponse` để loại bỏ quan hệ tròn JPA Entity gây rò rỉ bảo mật.
- **Admin Dashboard**: Thay thế toàn bộ biểu đồ vector SVG tĩnh và mảng dữ liệu giả bằng thư viện biểu đồ động kết nối API thật.

### 7.4. Những gì CẦN PHÁT TRIỂN MỚI (Develop from Scratch)
- **Toàn bộ hệ thống Order & Checkout** (`OrderService`, `OrderController`, `CheckoutPage`, `OrdersPage`, `AdminOrdersPage`).
- **Toàn bộ hệ thống User Management** (`UserController`, `UserAddressRepository`, sổ địa chỉ, đổi mật khẩu).
- **Bộ kiểm thử tự động (Unit & Integration Tests)** cho cả 2 phía backend và frontend.
- **Cấu hình CORS & Production Environment Configuration** (`.env.example`, `VITE_API_BASE_URL`).

### 7.5. Rủi ro nếu tiếp tục phát triển tính năng mới ngay lập tức
1. **Rủi ro sập dữ liệu (Data Crash)**: Bất kỳ thao tác nào vô tình kích hoạt truy vấn `product.getReviews()` sẽ làm sập ứng dụng vì lỗi thiếu cột `product_id`.
2. **Rủi ro rò rỉ tài khoản (Account Hijacking)**: Việc truyền JWT trên URL trong môi trường công cộng sẽ bị các công cụ logging, proxy cache hoặc plugin trình duyệt ghi nhận.
3. **Rủi ro vỡ nợ kỹ thuật (Compounding Technical Debt)**: Tiếp tục viết thêm tính năng trên một backend thiếu test và một frontend có 40% dead UI sẽ làm tăng chi phí sửa chữa lên gấp 3 đến 5 lần trong tương lai.
