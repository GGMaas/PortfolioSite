namespace C__.DTOs;

public class ProjectResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string img { get; set; } = string.Empty;
    public string link { get; set; } = string.Empty;
    public int year { get; set; }
}

public class CreateProjectDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string img { get; set; } = string.Empty;
    public string link { get; set; } = string.Empty;
    public int year { get; set; }
}