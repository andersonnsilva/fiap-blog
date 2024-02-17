import { useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { client } from "../lib/createClient";
import { Pagination } from 'react-bootstrap';
import { Link } from "react-router-dom";

const PAGE_SIZE = 3;

export const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchContent = async (page) => {
        try {
          const response = await client.getEntries({
            content_type: 'blogPost', // Substitua por seu tipo de conteúdo no Contentful
            limit: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
          });
    
          setPosts(response.items);
          setTotalPages(Math.ceil(response.total / PAGE_SIZE));
        } catch (error) {
          console.error('Error fetching content:', error);
        }
      };
    
      useEffect(() => {
        fetchContent(currentPage);
      }, [currentPage]);
    
      const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <main className="col-md-8">
                        <h1 className="my-3">Todos os Posts</h1>

                        {posts.map(post => (
                            <div className="card mb-3" key={post.sys.id}>
                                <div className="card-body">
                                    <h5 className="card-title">{post.fields.postTitle}</h5>
                                    <p className="card-text">{post.fields.postDescription}</p>
                                    <Link to={`/post/${post.fields.postSlug}`} className="card-link">
                                        Ver post
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </main>
                </div>

                <Pagination>
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>

                <div className="mt-1">
                    <Link to="/" className="btn btn-primary">
                        Voltar para Home
                    </Link>
                </div>
            </div>
        </Layout>
    )
}