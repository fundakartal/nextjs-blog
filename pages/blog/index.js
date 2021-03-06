import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Post from '../../components/post'

export default function BlogPage({ posts }) {
  return (
    <div className='container-2xl space-y-6'>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    )
    const { data: frontMatter } = matter(markdownWithMeta)

    return {
      frontMatter,
      slug: filename.split('.')[0],
    }
  })

  return {
    props: {
      posts: posts.sort((a, b) => {
        return new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
      }),
    },
  }
}
