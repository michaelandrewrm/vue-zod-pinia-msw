import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import UserDetailView from '@/views/UserDetailView.vue';
import { server } from '@/mocks/server';
import { http, HttpResponse, delay } from 'msw';
import { baseUrl } from '@/constants';

describe('UserDetailView Integration Tests', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  it('should display users', async () => {
    wrapper = mount(UserDetailView, { props: { id: '1' } });

    await flushPromises();

    expect(wrapper.find('.status-text').text()).toBe('active');
    expect(wrapper.find('.user-name').text()).toBe('John Doe');
    expect(wrapper.find('.user-role').text()).toBe('Senior Developer');
    expect(wrapper.find('.user-email').text()).toBe('john.doe@example.com');
    expect(wrapper.find('.user-phone').text()).toBe('+1 (555) 123-4567');
  });

  it('should display a loading state when getting users', async () => {
    server.use(
      http.get(`${baseUrl}/users/:userId`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    const wrapper = mount(UserDetailView, { props: { id: '1' } });

    await flushPromises();

    expect(wrapper.find('.loading').text()).toBe('Loading user details...');
  });

  it('should display an error when loading users fails', async () => {
    server.use(
      http.get(`${baseUrl}/users/:userId`, () => {
        return HttpResponse(null, { status: 500 });
      })
    );

    const wrapper = mount(UserDetailView, { props: { id: '1' } });

    await flushPromises();

    expect(wrapper.find('.error-icon').text()).toBe('⚠️');
    expect(wrapper.find('.error-message').text()).toBe('Failed to fetch user details');
  });
});
