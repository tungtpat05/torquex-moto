package com.company.torquexmoto.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserSummaryResponse {
    private long totalUsers;
    private long internalCount;
    private long staffCount;
    private long adminCount;
    private long customerCount;
    private long activeCount;
    private long lockedCount;
    private long googleCustomerCount;
}
