<script setup>
// Import sidebar component
import SidebarMenu from '../../../components/SidebarMenu.vue'

// Import ref and onMounted
import { ref, onMounted } from 'vue';

// Import js cookie
import Cookies from 'js-cookie';

// Import api
import api from '../../../services/api';

// Get token from cookies
const token = Cookies.get('token');

// Define state
const users = ref([]);
const userIdToDelete = ref(null);

// Method fetchDataUsers
const fetchDataUsers = async () => {
    // Fetch data
    api.defaults.headers.common['Authorization'] = token;
    await api.get('/api/admin/users')
        .then(response => {
            // Set response data to state "users"
            users.value = response.data.data;
        });
};

// Run hook "onMounted"
onMounted(() => {
    // Call method "fetchDataUsers"
    fetchDataUsers();
});

const confirmDeleteUser = (id) => {
    userIdToDelete.value = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
};

const deleteUser = async () => {
    // Delete user with API
    api.defaults.headers.common['Authorization'] = token;
    await api.delete(`/api/admin/users/${userIdToDelete.value}`)
        .then(() => {
            // Call method "fetchDataUsers"
            fetchDataUsers();
        });

    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
};

</script>

<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-3">
                <SidebarMenu />
            </div>
            <div class="col-md-9">
                <div class="card border-0 rounded shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>USERS</span>
                        <router-link :to="{ name: 'admin.users.create' }"
                            class="btn btn-sm btn-success rounded shadow-sm border-0">ADD USER</router-link>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Email Address</th>
                                    <th scope="col" style="width:17%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="users.length == 0">
                                    <td colspan="4" class="text-center">
                                        <div class="alert alert-danger mb-0">
                                            Data Belum Tersedia!
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else v-for="(user, index) in users" :key="index">
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.email }}</td>
                                    <td class="text-center">
                                        <router-link :to="{ name: 'admin.users.edit', params: { id: user.id } }"
                                            class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</router-link>
                                        <button @click="confirmDeleteUser(user.id)"
                                            class="btn btn-sm btn-danger rounded-sm shadow border-0">DELETE</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this user?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="deleteUser">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>
