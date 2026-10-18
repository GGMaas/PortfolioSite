namespace C__.DTOs;

public class BlogpostResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string DateLabel { get; set; } = string.Empty;
}

public class CreateBlogpostDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}