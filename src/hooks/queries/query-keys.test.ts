import { queryKeys } from './query-keys'

// Query keys 출력 테스트
console.log('=== Query Keys Test ===\n')

console.log('posts.all:', queryKeys.posts.all)
console.log('posts.lists():', queryKeys.posts.lists())
console.log('posts.list("react"):', queryKeys.posts.list('react'))
console.log('posts.details():', queryKeys.posts.details())
console.log('posts.detail("123"):', queryKeys.posts.detail('123'))

console.log('\ntags.all:', queryKeys.tags.all)
console.log('tags.lists():', queryKeys.tags.lists())

console.log('\nuser.all:', queryKeys.user.all)
console.log('user.me():', queryKeys.user.me())

console.log('\nreplies.all:', queryKeys.replies.all)
console.log('replies.lists():', queryKeys.replies.lists())
console.log('replies.list("post-123"):', queryKeys.replies.list('post-123'))

console.log('\nempathies.all:', queryKeys.empathies.all)
