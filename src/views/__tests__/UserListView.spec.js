import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import UserListView from '@/views/UserListView.vue';
import { server } from '@/mocks/server';
import { http, HttpResponse, delay } from 'msw';
import { baseUrl } from '@/constants';

describe('UserListView Integration Tests', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  it('should display users', async () => {
    wrapper = mount(UserListView);

    await flushPromises();

    // Should display user cards
    const userCards = wrapper.findAllComponents({ name: 'UserCard' });
    expect(userCards.length).toBe(5);

    // Verify first user is rendered
    const firstCard = userCards[0];
    expect(firstCard.props('user').name).toBe('John Doe');
    expect(firstCard.props('user').email).toBe('john.doe@example.com');
  });

  it('should display a loading state when getting users', async () => {
    server.use(
      http.get(`${baseUrl}/users`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    const wrapper = mount(UserListView);

    await flushPromises();

    expect(wrapper.find('.loading').text()).toBe('Loading users...');
  });

  it('should display an error when loading users fails', async () => {
    server.use(
      http.get(`${baseUrl}/users`, () => {
        return HttpResponse(null, { status: 500 });
      })
    );

    const wrapper = mount(UserListView);

    await flushPromises();

    expect(wrapper.find('.error-icon').text()).toBe('⚠️');
    expect(wrapper.find('.error-message').text()).toBe('Failed to fetch users');
  });
});
