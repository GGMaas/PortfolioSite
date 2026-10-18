using C__.DTOs;

namespace C__.Services;

public class BlogpostService : IBlogpostService
{
    private static readonly List<BlogpostResponseDto> _blogposts = new()
    {
    };

    public List<BlogpostResponseDto> GetAll() => _blogposts;

    public BlogpostResponseDto? GetById(int id)
        => _blogposts.FirstOrDefault(b => b.Id == id);

    public BlogpostResponseDto Create(CreateBlogpostDto dto)
    {
        var newBlogpost = new BlogpostResponseDto
        {
            Id = _blogposts.Count > 0 ? _blogposts.Max(b => b.Id) + 1 : 1,
            Title = dto.Title,
            Description = dto.Description,
            Date = DateTime.Now
        };
        _blogposts.Add(newBlogpost);
        return newBlogpost;
    }

    public bool Update(int id, CreateBlogpostDto dto)
    {
        var existing = GetById(id);
        if (existing == null) return false;

        existing.Title = dto.Title;
        existing.Description = dto.Description;
        return true;
    }

    public bool Delete(int id)
    {
        var existing = GetById(id);
        if (existing == null) return false;

        _blogposts.Remove(existing);
        return true;
    }
}