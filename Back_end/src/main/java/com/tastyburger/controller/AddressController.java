package com.tastyburger.controller;

import com.tastyburger.dto.request.AddressRequest;
import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.entity.Address;
import com.tastyburger.entity.User;
import com.tastyburger.repository.AddressRepository;
import com.tastyburger.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Address>>> getAddresses() {
        User user = getCurrentUser();
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(addresses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Address>> addAddress(@Valid @RequestBody AddressRequest request) {
        User user = getCurrentUser();
        if (request.getIsDefault()) {
            addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                    .forEach(a -> { a.setDefault(false); addressRepository.save(a); });
        }
        Address address = new Address();
        address.setUser(user);
        address.setLabel(request.getLabel());
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddress(request.getAddress());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZip(request.getZip());
        address.setDefault(request.getIsDefault());
        addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok("Address added", address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Address>> updateAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest request) {
        User user = getCurrentUser();
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new com.tastyburger.exception.UnauthorizedException("Not authorized");
        }
        if (request.getIsDefault()) {
            addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                    .forEach(a -> { a.setDefault(false); addressRepository.save(a); });
        }
        address.setLabel(request.getLabel());
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddress(request.getAddress());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZip(request.getZip());
        address.setDefault(request.getIsDefault());
        addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok("Address updated", address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new com.tastyburger.exception.UnauthorizedException("Not authorized");
        }
        addressRepository.delete(address);
        return ResponseEntity.ok(ApiResponse.ok("Address deleted", null));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<ApiResponse<Void>> setDefault(@PathVariable Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new com.tastyburger.exception.UnauthorizedException("Not authorized");
        }
        addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .forEach(a -> { a.setDefault(false); addressRepository.save(a); });
        address.setDefault(true);
        addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok("Default address set", null));
    }
}
