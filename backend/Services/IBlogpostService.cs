using C__.DTOs;

namespace C__.Services;

public interface IBlogpostService
{
    List<BlogpostResponseDto> GetAll();
    BlogpostResponseDto? GetById(int id);
    BlogpostResponseDto Create(CreateBlogpostDto dto);
    bool Update(int id, CreateBlogpostDto dto);
    bool Delete(int id);
}